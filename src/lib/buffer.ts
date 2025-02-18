export class FifoBuffer {
	size: number;
	elements: number[];
	constructor(size: number, elements: number[]) {
		this.size = size;
		this.elements = elements;
	}

	public push(val: number[]) {
		const newElements = [...this.elements, ...val];

		// Ensure the buffer size limit is maintained
		while (newElements.length > this.size) {
			newElements.shift();
		}

		return new FifoBuffer(this.size, newElements);
	}

	public getElements() {
		return this.elements;
	}
}
