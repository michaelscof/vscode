/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResolvedKeybinding, Keybinding, SimpleKeybinding } from 'vs/base/common/keyCodes';
import { Event } from 'vs/base/common/event';
import { IKeybindingService, IKeybindingEvent, IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { IContextKey, IContextKeyService, IContextKeyServiceTarget, ContextKeyExpr, IContextKeyChangeEvent } from 'vs/platform/contextkey/common/contextkey';
import { IResolveResult } from 'vs/platform/keybinding/common/keybindingResolver';
import { USLayoutResolvedKeybinding } from 'vs/platform/keybinding/common/usLayoutResolvedKeybinding';
import { OS } from 'vs/base/common/platform';
import { ResolvedKeybindingItem } from 'vs/platform/keybinding/common/resolvedKeybindingItem';

class MockKeybindingContextKey<T> implements IContextKey<T> {
	private _defaultValue: T | undefined;
	private _value: T | undefined;

	constructor(defaultValue: T | undefined) {
		this._defaultValue = defaultValue;
		this._value = this._defaultValue;
	}

	public set(value: T | undefined): void {
		this._value = value;
	}

	public reset(): void {
		this._value = this._defaultValue;
	}

	public get(): T | undefined {
		return this._value;
	}
}

export class MockContextKeyService implements IContextKeyService {

	public _serviceBrand: any;
	private _keys = new Map<string, IContextKey<any>>();

	public dispose(): void {
		//
	}
	public createKey<T>(key: string, defaultValue: T | undefined): IContextKey<T> {
		let ret = new MockKeybindingContextKey(defaultValue);
		this._keys.set(key, ret);
		return ret;
	}
	public contextMatchesRules(rules: ContextKeyExpr): boolean {
		return false;
	}
	public get onDidChangeContext(): Event<IContextKeyChangeEvent> {
		return Event.None;
	}
	public getContextKeyValue(key: string) {
		if (this._keys.has(key)) {
			return this._keys.get(key).get();
		}
	}
	public getContext(domNode: HTMLElement): any {
		return null;
	}
	public createScoped(domNode: HTMLElement): IContextKeyService {
		return this;
	}
}

export class MockKeybindingService implements IKeybindingService {
	public _serviceBrand: any;

	public get onDidUpdateKeybindings(): Event<IKeybindingEvent> {
		return Event.None;
	}

	public getDefaultKeybindingsContent(): string {
		return '';
	}

	public getDefaultKeybindings(): ResolvedKeybindingItem[] {
		return [];
	}

	public getKeybindings(): ResolvedKeybindingItem[] {
		return [];
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		return [new USLayoutResolvedKeybinding(keybinding, OS)];
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		let keybinding = new SimpleKeybinding(
			keyboardEvent.ctrlKey,
			keyboardEvent.shiftKey,
			keyboardEvent.altKey,
			keyboardEvent.metaKey,
			keyboardEvent.keyCode
		);
		return this.resolveKeybinding(keybinding)[0];
	}

	public resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
		return [];
	}

	public lookupKeybindings(commandId: string): ResolvedKeybinding[] {
		return [];
	}

	public lookupKeybinding(commandId: string): ResolvedKeybinding | null {
		return null;
	}

	public customKeybindingsCount(): number {
		return 0;
	}

	public softDispatch(keybinding: IKeyboardEvent, target: IContextKeyServiceTarget): IResolveResult | null {
		return null;
	}

	dispatchEvent(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean {
		return false;
	}

	mightProducePrintableCharacter(e: IKeyboardEvent): boolean {
		return false;
	}
}
