package tree_sitter_gab_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-gab"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_gab.Language())
	if language == nil {
		t.Errorf("Error loading Gab grammar")
	}
}
