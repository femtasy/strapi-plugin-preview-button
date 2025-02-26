import { useEffect, useState } from 'react';
import { useStrapiApp } from '@strapi/helper-plugin';

import { HOOK_BEFORE_BUILD_URL } from '../constants';
import { usePluginConfig } from '../hooks';
import { parseUrl } from '../utils';

const usePreviewUrl = ( uid, data, isDraft, isCreating ) => {
  const { runHookWaterfall } = useStrapiApp();
  const { config, isLoading } = usePluginConfig();
  const [ url, setUrl ] = useState( null );
  const [ publishedUrl, setPublishedUrl ] = useState( null );
  const [ canCopy, setCopy ] = useState( true );

  const { contentTypes } = config;

  const match = contentTypes?.find( type => type.uid === uid );
  const isSupportedType = !! match;

  useEffect( () => {
    if ( isLoading || isCreating || ! isSupportedType ) {
      return;
    }

    //const stateFromConfig = match[ isDraft ? 'draft' : 'published' ];
    const stateFromConfig = match[ 'draft' ]; // Treat everything as draft except when using publishedUrl
    const { state } = runHookWaterfall( HOOK_BEFORE_BUILD_URL, { state: stateFromConfig, data } );
    const url = parseUrl( state, data );
    const publishedUrl = parseUrl(match[ 'published' ], data)

    if ( ! url ) {
      return;
    }

    setUrl( url );
    setPublishedUrl( publishedUrl );
    setCopy( state?.copy === false ? false : true );
  }, [ isDraft, isCreating, isLoading, data ] );

  return {
    canCopy,
    isLoading,
    isSupportedType,
    url,
    publishedUrl
  };
};

export default usePreviewUrl;
