export default class Node<T> {
	public next: Node<T> | null = null;

	public previous: Node<T> | null = null;

	public value: NonNullable<T>;

	constructor(value: T) {
		if (value == null) {
			throw new Error('Invalid value type');
		}

		this.value = value;
	}
}
