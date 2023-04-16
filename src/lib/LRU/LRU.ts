import Node from './Node';

export default class LRU<T> {
	private readonly map = new Map<T, Node<T>>();

	private head: Node<T> | null = null;

	private tail: Node<T> | null = null;

	size = 0;

	constructor(public maxSize = 64) {}

	private pop(): Node<T> | null {
		if (this.size <= 1 || this.tail?.previous == null) {
			return this.clear();
		}

		const tailNode: Node<T> = this.tail;

		this.tail = this.tail.previous;
		this.tail.next = null;

		this.size -= 1;

		tailNode.next = null;
		tailNode.previous = null;

		return tailNode;
	}

	private shift(): Node<T> | null {
		if (this.size <= 1 || this.head?.next == null) {
			return this.clear();
		}

		const headNode = this.head;

		this.head = this.head.next;
		this.head.previous = null;

		this.size -= 1;

		headNode.next = null;

		return headNode;
	}

	private unshift(node: Node<T>): Node<T> | Error {
		const newNode = node;

		if (this.size === 0 || this.head == null || this.tail == null) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			newNode.next = this.head;
			this.head.previous = newNode;
			this.head = newNode;
		}

		this.size += 1;

		return newNode;
	}

	private remove(node: Node<T>): Node<T> {
		if (node === this.head) {
			const removedNode = this.shift();
			if (removedNode != null) {
				return removedNode;
			}
		}

		if (node === this.tail) {
			const removedNode = this.pop();
			if (removedNode != null) {
				return removedNode;
			}
		}

		const targetNode: Node<T> = node;

		const { next, previous } = targetNode;

		if (previous?.next != null) {
			previous.next = next;
		}

		if (next?.previous != null) {
			next.previous = previous;
		}

		targetNode.next = null;
		targetNode.previous = null;

		this.size -= 1;

		return targetNode;
	}

	clear(): Node<T> | null {
		const clearedNode: Node<T> | null = this.head;

		if (this.tail?.previous != null) {
			let currentNode: Node<T> | null = this.tail;

			for (let idx = this.size - 1; idx >= 0; idx -= 1) {
				if (currentNode == null) {
					break;
				}

				const previousNode: Node<T> | null = currentNode.previous;

				currentNode.next = null;
				currentNode.previous = null;

				currentNode = previousNode;
			}
		}

		this.head = null;
		this.tail = null;
		this.size = 0;

		this.map.clear();

		return clearedNode;
	}

	get(value: T): Node<T> | undefined {
		const node: Node<T> | undefined = this.map.get(value);

		if (node == null) {
			return undefined;
		}

		const removedNode: Node<T> = this.remove(node);

		this.unshift(removedNode);

		return node;
	}

	add(value: T): Node<T> {
		const newNode = new Node(value);

		if (this.get(value) == null) {
			this.unshift(newNode);
		}

		this.map.set(value, newNode);

		if (this.size > this.maxSize && this.tail != null) {
			this.evict(this.tail.value);
		}

		return newNode;
	}

	evict(value: T): Node<T> | undefined {
		const node: Node<T> | undefined = this.map.get(value);

		if (node == null) {
			return undefined;
		}

		this.remove(node);
		this.map.delete(value);

		return node;
	}
}
