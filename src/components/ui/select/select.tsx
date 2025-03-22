import { useEffect, useRef, useState } from "react";
import styles from "./select.module.scss";
import arrowDown from "../../../assets/arrow-down.svg";
import tick from "../../../assets/tick.svg";

export type OptionType = { key: string; value: string };

interface ISelectProps {
  onChange?: (_: OptionType[]) => void;
  options: OptionType[];
}

function Select({ onChange, options }: ISelectProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [localOptions, setLocalOptions] = useState<OptionType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const exists = localOptions.some(
        (opt) => opt.value === inputValue.trim()
      );
      if (!exists) {
        const newOption = {
          key: inputValue.trim(),
          value: inputValue.trim(),
        };
        setLocalOptions((prev) => [newOption, ...prev]);
        setInputValue("");
      }
    }
  };

  const handleOptionClick = (option: OptionType) => {
    setSelected((prev) =>
      prev.includes(option.value)
        ? prev.filter((item) => item !== option.value)
        : [...prev, option.value]
    );

    const updated = selected.includes(option.value)
      ? selected.filter((item) => item !== option.value)
      : [...selected, option.value];

    onChange?.(localOptions.filter((opt) => updated.includes(opt.value)));

    inputRef.current?.focus();
    setInputValue("");
  };

  const handleRemoveSelected = (option: string) => {
    const updated = selected.filter((item) => item !== option);
    setSelected(updated);
    onChange?.(localOptions.filter((opt) => updated.includes(opt.value)));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputContainer}>
        <div className={styles.selectedItems}>
          {selected.map((item) => (
            <span
              className={styles.selectedItem}
              key={item}
              onClick={() => handleRemoveSelected(item)}
              onKeyDown={() => handleRemoveSelected(item)}
            >
              {`${item.slice(0, 1).toUpperCase()}${item.slice(1)}${
                selected.length > 1 ? "," : ""
              } `}
            </span>
          ))}
        </div>
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onClick={() => setIsOpen(true)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputClick}
          disabled={!!selected.length && isOpen}
          className={`${styles.input} ${isOpen ? styles.active : ""}`}
          placeholder={selected.length ? "" : "Type..."}
        />
        <span
          className={`${styles.icon} ${isOpen ? styles.open : styles.close}`}
        >
          <img src={arrowDown} alt="arrowDown" />
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownInner}>
            {localOptions.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${
                  selected.includes(option.value) ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick(option)}
                onKeyDown={() => handleOptionClick(option)}
              >
                {option.key}
                {selected.includes(option.value) && (
                  <span className={`${styles.icon} ${styles.tick}`}>
                    <img src={tick} alt="tick" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Select;
