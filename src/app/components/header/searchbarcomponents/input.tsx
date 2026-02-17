import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Autocomplete, { AddressFields } from './autocomplete';
import PageContext from '../../contextprovider';
import { loadGoogleMapsScript } from '@/hooks/loadMapScript';
import { useGlobalStore } from '@/lib/store/global-store';

type InputProps = {
  onChange?: (suggestions: AddressFields) => void;
  onChangeInput?: (
    suggestion: google.maps.places.AutocompletePrediction[]
  ) => void;
  Query?: (query: string) => void;
  onFocus?: () => void;
  currentLocation?: boolean;
  className?: string;
  autocomplete?: boolean;
};

export default function Input({
  onChange,
  onChangeInput,
  Query,
  currentLocation = false,
  autocomplete,
  className = 'w-full bg-transparent outline-none',
}: InputProps) {
  const { i18 } = useContext(PageContext);
  const { GooglemapLoader } = useGlobalStore();
  const SearchBar =
    typeof i18?.HOMEPAGE?.HEADER?.SEARCHBAR === 'object'
      ? i18?.HOMEPAGE?.HEADER?.SEARCHBAR
      : undefined;
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: value }, predictions => {
        if (predictions) {
          setSuggestions(predictions);
          if (onChangeInput) {
            onChangeInput(predictions);
          }
          if (Query) {
            Query(value);
          }
        }
      });
    },
    [onChangeInput, Query]
  );

  // useEffect(() => {
  //   if (query.trim() !== '')
  //     handleChange(query);
  // }, [query, handleChange]);

  useEffect(() => {
    if (!GooglemapLoader) loadGoogleMapsScript();
  }, [GooglemapLoader]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        className={` ${className}`}
        placeholder={
          (typeof SearchBar?.SEARCHDESTINATION === 'string' &&
            SearchBar?.SEARCHDESTINATION) ||
          'Search destinations'
        }
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        onFocus={() => {
          setShowSuggestions(true);
        }}
      />
      {Array.isArray(suggestions) && showSuggestions && autocomplete && (
        <div className="w-full max-w-2xl mt-1 bg-white rounded-lg shadow-lg border max-h-[250px] overflow-y-auto scrollbar-hide">
          <Autocomplete
            currentLocation={currentLocation}
            active={'where'}
            showSuggestions={true}
            query={query}
            suggestions={suggestions}
            onClickSuggestion={address => {
              setShowSuggestions(false);
              if (onChange) {
                onChange(address);
              }
              if (address?.address) {
                setQuery(address.address);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
