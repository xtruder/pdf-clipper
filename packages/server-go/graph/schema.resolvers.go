package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"time"

	"github.com/xtruder/pdf-clipper/packages/server-go/graph/generated"
	"github.com/xtruder/pdf-clipper/packages/server-go/graph/model"
)

// PushAccountChanges is the resolver for the pushAccountChanges field.
func (r *mutationResolver) PushAccountChanges(ctx context.Context, input []model.AccountInput) (*model.AccountUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// PushAccountInfoChanges is the resolver for the pushAccountInfoChanges field.
func (r *mutationResolver) PushAccountInfoChanges(ctx context.Context, input []model.AccountInfoInput) (*model.AccountInfoUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// PushSessionChanges is the resolver for the pushSessionChanges field.
func (r *mutationResolver) PushSessionChanges(ctx context.Context, input []model.SessionInput) (*model.SessionUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// PushDocumentChanges is the resolver for the pushDocumentChanges field.
func (r *mutationResolver) PushDocumentChanges(ctx context.Context, input []model.DocumentInput) (*model.DocumentUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// PushDocumentMemberChanges is the resolver for the pushDocumentMemberChanges field.
func (r *mutationResolver) PushDocumentMemberChanges(ctx context.Context, input []model.DocumentMemberInput) (*model.DocumentMemberUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// PushDocumentHighlightChanges is the resolver for the pushDocumentHighlightChanges field.
func (r *mutationResolver) PushDocumentHighlightChanges(ctx context.Context, input []model.DocumentHighlightInput) (*model.DocumentHighlightUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// PushBlobInfoChanges is the resolver for the pushBlobInfoChanges field.
func (r *mutationResolver) PushBlobInfoChanges(ctx context.Context, input []model.BlobInfoInput) (*model.BlobInfoUpdateResult, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetAccountChanges is the resolver for the getAccountChanges field.
func (r *queryResolver) GetAccountChanges(ctx context.Context, since time.Time, limit *int) ([]model.Account, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetAccountInfoChanges is the resolver for the getAccountInfoChanges field.
func (r *queryResolver) GetAccountInfoChanges(ctx context.Context, since time.Time, limit *int) ([]model.AccountInfo, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetSessionChanges is the resolver for the getSessionChanges field.
func (r *queryResolver) GetSessionChanges(ctx context.Context, since time.Time, limit *int) ([]model.Session, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetDocumentChanges is the resolver for the getDocumentChanges field.
func (r *queryResolver) GetDocumentChanges(ctx context.Context, since time.Time, limit *int) ([]model.Document, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetDocumentMemberChanges is the resolver for the getDocumentMemberChanges field.
func (r *queryResolver) GetDocumentMemberChanges(ctx context.Context, since time.Time, limit *int) ([]model.DocumentMember, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetDocumentHighlightChanges is the resolver for the getDocumentHighlightChanges field.
func (r *queryResolver) GetDocumentHighlightChanges(ctx context.Context, since time.Time, limit *int) ([]model.DocumentHighlight, error) {
	panic(fmt.Errorf("not implemented"))
}

// GetBlobInfoChanges is the resolver for the getBlobInfoChanges field.
func (r *queryResolver) GetBlobInfoChanges(ctx context.Context, since time.Time, limit *int) ([]model.BlobInfo, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncAccountUpdates is the resolver for the syncAccountUpdates field.
func (r *subscriptionResolver) SyncAccountUpdates(ctx context.Context) (<-chan []model.Account, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncAccountInfoUpdates is the resolver for the syncAccountInfoUpdates field.
func (r *subscriptionResolver) SyncAccountInfoUpdates(ctx context.Context) (<-chan []model.AccountInfo, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncSessionUpdates is the resolver for the syncSessionUpdates field.
func (r *subscriptionResolver) SyncSessionUpdates(ctx context.Context) (<-chan []model.Session, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncDocumentUpdates is the resolver for the syncDocumentUpdates field.
func (r *subscriptionResolver) SyncDocumentUpdates(ctx context.Context) (<-chan []model.Document, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncDocumentMemberUpdates is the resolver for the syncDocumentMemberUpdates field.
func (r *subscriptionResolver) SyncDocumentMemberUpdates(ctx context.Context) (<-chan []model.DocumentMember, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncDocumentHighlightUpdates is the resolver for the syncDocumentHighlightUpdates field.
func (r *subscriptionResolver) SyncDocumentHighlightUpdates(ctx context.Context) (<-chan []model.DocumentHighlight, error) {
	panic(fmt.Errorf("not implemented"))
}

// SyncBlobInfoUpdates is the resolver for the syncBlobInfoUpdates field.
func (r *subscriptionResolver) SyncBlobInfoUpdates(ctx context.Context) (<-chan []model.BlobInfo, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
