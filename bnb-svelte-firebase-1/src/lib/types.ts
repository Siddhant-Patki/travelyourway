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

export interface DiningListing {
	id: string;
	title: string;
	description: string;
	location: string;
	cuisine: string;
	imgSrc: string;
	pricePerPerson: number;
	maxGuests: number;
	userId: string;
	createdAt: Date;
	isAvailable?: boolean;
}

export interface DiningReservation {
	id?: string;
	diningId: string;
	userId: string;
	date: Date;
	guestCount: number;
	totalPrice: number;
	paymentMethod?: 'card' | 'tokens';
	bookingCode?: string;
	reservedAt?: Date;
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
	bookingCode?: string;
	reservedAt?: Date;
	createdAt: Date;
}