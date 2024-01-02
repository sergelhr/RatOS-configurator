import React, { useState } from 'react';
import { StepNavButtons } from '../step-nav-buttons';
import { StepScreenProps } from '../../hooks/useSteps';
import { DropdownWithPrinterQuery } from '../forms/dropdown';
import { usePrinterConfiguration } from '../../hooks/usePrinterConfiguration';
import { ErrorMessage } from '../common/error-message';
import { Toggle } from '../forms/toggle';
import { PrinterRailSettings } from './printer-rail-settings';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { deserializePrinterRailDefinition } from '../../utils/serialization';
import { ToolheadSettings } from './toolhead-settings';
import { Spinner } from '../common/spinner';

export const HardwareSelection: React.FC<StepScreenProps> = (props) => {
	const [animate] = useAutoAnimate();
	const [advancedSteppers, setAdvancedSteppers] = useState(false);
	const {
		selectedControllerFan,
		selectedBoard,
		selectedPrinter,
		performanceMode,
		setPerformanceMode,
		stealthchop,
		setStealthchop,
		standstillStealth,
		setStandstillStealth,
		selectedPrinterRails,
		setSelectedControllerFan: setControllerFan,
		serializedPrinterConfiguration,
		parsedPrinterConfiguration,
		partialPrinterConfiguration,
	} = usePrinterConfiguration();
	const errors: string[] = [];
	if (partialPrinterConfiguration != null) {
		if (parsedPrinterConfiguration.success === false) {
			parsedPrinterConfiguration.error.flatten().formErrors.forEach((message) => {
				errors.push(message);
			});
		}
	}
	return (
		<>
			<div className="p-8">
				<div className="mb-5 border-b border-zinc-200 pb-5 dark:border-zinc-700">
					<h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
						Select your printer hardware
					</h3>
					<p className="mt-2 max-w-4xl text-sm text-zinc-500 dark:text-zinc-400">
						If your hardware isn't listed, pick the one closest to it and override as necessary in printer.cfg later
					</p>
				</div>
				<div ref={animate} className="flex flex-col">
					{errors.length > 0 && (
						<ErrorMessage className="mb-4">
							{errors.map((e) => (
								<div className="mt-2" key={e}>
									{e}
								</div>
							))}
						</ErrorMessage>
					)}
					<div className="space-y-4">
						{serializedPrinterConfiguration?.toolheads?.map((th, i) =>
							th == null || th.axis == null ? null : (
								<React.Suspense fallback={<Spinner />} key={i}>
									<ToolheadSettings toolOrAxis={th.axis} />
								</React.Suspense>
							),
						)}
					</div>
					<div className="mt-4 border-t border-zinc-100 pt-8 dark:border-zinc-700">
						<div className="flex">
							<h3 className="flex-1 text-base font-medium leading-7 text-zinc-900 dark:text-zinc-100">Electronics</h3>
						</div>
						<p className="mt-2 max-w-4xl text-sm text-zinc-500 dark:text-zinc-400">
							Configure miscellaneous electronics settings
						</p>
					</div>
					<div className="mt-4 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-700 sm:grid-cols-2">
						<div>
							<DropdownWithPrinterQuery
								label="Controller fan"
								query="controllerFanOptions"
								vars={{ config: serializedPrinterConfiguration }}
								onSelect={setControllerFan}
								value={selectedControllerFan}
							/>
						</div>
					</div>
					<div className="mt-4 border-t border-zinc-100 pt-8 dark:border-zinc-700">
						<div className="flex">
							<h3 className="flex-1 text-base font-medium leading-7 text-zinc-900 dark:text-zinc-100">Motion</h3>
							<div>
								<Toggle label="Simple" onLabel="Advanced" onChange={setAdvancedSteppers} value={!!advancedSteppers} />
							</div>
						</div>
						<p className="mt-2 max-w-4xl text-sm text-zinc-500 dark:text-zinc-400">
							Configure your stepper motor and driver settings
						</p>
					</div>
					<div className="mt-4 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-700 sm:grid-cols-2">
						{selectedPrinter?.speedLimits.performance && (
							<div className="col-span-2">
								<Toggle
									label="Performance mode"
									description="Increases the stepper power, max acceleration and velocity. Not recommended for initial setup. Requires actively cooled drivers (controller fan)."
									onChange={setPerformanceMode}
									value={!!performanceMode}
								/>
							</div>
						)}
						<div className="col-span-2">
							<Toggle
								label="Stealtchop"
								description="Silent operation at the cost of a 135 mm/s velocity limit and less positional accuracy. Not recommended unless quiteness is absolutely necessary."
								onChange={setStealthchop}
								value={!!stealthchop}
							/>
						</div>
						<div className="col-span-2">
							<Toggle
								label="Standstill Stealth"
								description="Makes steppers stilent when idling, but can cause unpredictable behavior on some drivers. Can result in skipped steps and positional errors, use with caution."
								onChange={setStandstillStealth}
								value={!!standstillStealth}
							/>
						</div>
					</div>
				</div>
				<div>
					{advancedSteppers && selectedPrinter && (
						<div className="grid gap-4 py-4 sm:grid-cols-2">
							{selectedPrinterRails.map((rail) => {
								const defaultRail = selectedPrinter.defaults.rails.find((r) => r.axis === rail.axis);
								if (defaultRail == null) {
									throw new Error('No printer default for axis ' + rail.axis);
								}
								return (
									<div className="break-inside-avoid-column" key={rail.axis + (performanceMode ? 'performance' : '')}>
										<PrinterRailSettings
											selectedBoard={selectedBoard}
											printerRail={rail}
											printerRailDefault={deserializePrinterRailDefinition(defaultRail)}
											performanceMode={performanceMode}
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<StepNavButtons
				left={{ onClick: props.previousScreen }}
				right={{
					onClick: props.nextScreen,
					disabled: !parsedPrinterConfiguration.success,
					title: parsedPrinterConfiguration.success === false ? 'Invalid printer configuration selected' : undefined,
				}}
			/>
		</>
	);
};
