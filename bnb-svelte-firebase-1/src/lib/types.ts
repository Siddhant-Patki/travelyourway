export interface Listing {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	category: string;
	guestCount: number;
	roomCount: number;
	bathroomCount: number;
	userId: string;
	imgSrc: string;
	location: string;
	price: number;
	isAvailable?: boolean;
	availableFrom?: string;
	availableTo?: string;
	totalAvailableRooms?: number;
}

export interface Reservation {
	id?: string;
	listingId: string;
	userId: string;
	checkIn: Date;
	checkOut: Date;
	guestCount: number;
	totalPrice: number;
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
	paymentMethod?: 'card' | 'tokens';
	rewardTokens?: number;
	tokensSpent?: number;
	txHash?: string;
	burnTxHash?: string;
	reservedAt?: Date;
	createdAt: Date;
}