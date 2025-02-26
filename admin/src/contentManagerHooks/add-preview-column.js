import React from 'react';
import { Typography } from '@strapi/design-system';

import { ListViewTableCell } from '../components';
import { parseUrl, pluginId } from '../utils';

const addPreviewColumn = ( { displayedHeaders, layout }, pluginConfig ) => {
  const { contentTypes, injectListViewColumn, openTarget } = pluginConfig;
  const match = contentTypes?.find( type => type.uid === layout.contentType.uid );
  const isSupportedType = !! match;

  // Do nothing if this feature is not a supported type for the preview button.
  if ( ! isSupportedType || ! injectListViewColumn ) {
    return {
      displayedHeaders,
      layout,
    };
  }

  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        key: '__preview_key__',
        fieldSchema: {
          type: 'string',
        },
        metadatas: {
          label: 'URL',
          searchable: false,
          sortable: false,
        },
        name: 'preview',
        cellFormatter: data => {
          const hasDraftAndPublish = layout.contentType.options.draftAndPublish === true;
          //const isDraft = hasDraftAndPublish && ! data.publishedAt;
          const isDraft = false; // For the table, we treat it as production always! So there is no mistake.
          //const stateConfig = isSupportedType && match[ isDraft ? 'draft' : 'published' ];
          const stateConfig = isSupportedType && match[ 'published' ]; // For to show copy and open production page
          const url = parseUrl( stateConfig, data );

          if ( ! url ) {
            return null;
          }

          return (
            <ListViewTableCell
              canCopy={ stateConfig?.copy === false ? false : true }
              isDraft={ isDraft }
              target={ openTarget }
              url={ url }
            />
          );
        },
      },
    ],
    layout,
  };
}

export default addPreviewColumn;
