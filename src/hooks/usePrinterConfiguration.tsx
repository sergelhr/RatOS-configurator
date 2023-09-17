'use client';

import { atom, selector, useRecoilValue } from 'recoil';
import { z } from 'zod';
import { Board, Toolboard } from '../zods/boards';
import { Hotend, Thermistor, Extruder, Probe, Endstop } from '../zods/hardware';
import { Printer } from '../zods/printer';
import { PrinterConfiguration } from '../zods/printer-configuration';
import { useRecoilState } from 'recoil';
import { trpc } from '../helpers/trpc';
import { syncEffect } from 'recoil-sync';
import { getRefineCheckerForZodSchema } from 'zod-refine';

export const PrinterState = atom({
	key: 'Printer',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Printer.nullable()),
		}),
	],
});

export const PrinterSizeState = atom({
	key: 'PrinterOption',
	default: undefined,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Printer.shape.sizes.unwrap().element.optional()),
		}),
	],
});

export const HotendState = atom({
	key: 'Hotend',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Hotend.nullable()),
		}),
	],
});

export const ThermistorState = atom({
	key: 'Thermistor',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Thermistor.nullable()),
		}),
	],
});

export const ExtruderState = atom({
	key: 'Extruder',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Extruder.nullable()),
		}),
	],
});

export const ProbeState = atom({
	key: 'Probe',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Probe.nullable()),
		}),
	],
});

export const XEndstopState = atom({
	key: 'XEndstop',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Endstop.nullable()),
		}),
	],
});

export const YEndstopState = atom({
	key: 'YEndstop',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Endstop.nullable()),
		}),
	],
});

export const ControlboardState = atom({
	key: 'Board',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Board.nullable()),
		}),
	],
});

export const ToolboardState = atom({
	key: 'Toolboard',
	default: null,
	effects: [
		syncEffect({
			refine: getRefineCheckerForZodSchema(Toolboard.nullable()),
		}),
	],
});

export const PrinterConfigurationState = selector<z.infer<typeof PrinterConfiguration> | null>({
	key: 'PrinterConfiguration',
	get: ({ get }) => {
		const printer = get(PrinterState);
		const printerSize = get(PrinterSizeState);
		const hotend = get(HotendState);
		const thermistor = get(ThermistorState);
		const extruder = get(ExtruderState);
		const probe = get(ProbeState);
		const xEndstop = get(XEndstopState);
		const yEndstop = get(YEndstopState);
		const controlboard = get(ControlboardState);
		const toolboard = get(ToolboardState);

		const printerConfig = PrinterConfiguration.safeParse({
			printer,
			hotend,
			thermistor,
			extruder,
			probe,
			xEndstop,
			yEndstop,
			controlboard,
			toolboard,
			size: printerSize,
		});
		return printerConfig.success ? printerConfig.data : null;
	},
});

export const usePrinterConfiguration = () => {
	const [selectedPrinter, setSelectedPrinter] = useRecoilState(PrinterState);
	const [selectedPrinterOption, setSelectedPrinterOption] = useRecoilState(PrinterSizeState);
	const [selectedHotend, setSelectedHotend] = useRecoilState(HotendState);
	const [selectedExtruder, setSelectedExtruder] = useRecoilState(ExtruderState);
	const [selectedThermistor, setSelectedThermistor] = useRecoilState(ThermistorState);
	const [selectedProbe, setSelectedProbe] = useRecoilState(ProbeState);
	const [selectedXEndstop, setSelectedXEndstop] = useRecoilState(XEndstopState);
	const [selectedYEndstop, setSelectedYEndstop] = useRecoilState(YEndstopState);
	const [selectedBoard, setSelectedBoard] = useRecoilState(ControlboardState);
	const [selectedToolboard, setSelectedToolboard] = useRecoilState(ToolboardState);
	const printerConfiguration = useRecoilValue(PrinterConfigurationState);

	const hotends = trpc.useQuery(['printer.hotends']);
	const boards = trpc.useQuery(['mcu.boards']);
	const extruders = trpc.useQuery(['printer.extruders']);
	const thermistors = trpc.useQuery(['printer.thermistors']);
	const probes = trpc.useQuery(['printer.probes']);
	const xEndstops = trpc.useQuery(['printer.x-endstops']);
	const yEndstops = trpc.useQuery(['printer.y-endstops']);

	const setPrinterDefaults = (printer: z.infer<typeof Printer>) => {
		const board = boards.data?.find((board) => board.serialPath === '/dev/' + printer.defaults?.board);
		const toolboard = boards.data?.find((board) => board.serialPath === '/dev/' + printer.defaults?.board);
		const hotend = hotends.data?.find((h) => h.id === printer.defaults.hotend + '.cfg');
		const extruder = extruders.data?.find((e) => e.id === printer.defaults.extruder + '.cfg');
		const thermistor = thermistors.data?.find((t) => t === hotend?.thermistor);
		const probe = probes.data?.find((p) => p.id === printer.defaults.probe + '.cfg');
		const xEndstop = xEndstops.data?.find((e) => e.id === printer.defaults.xEndstop);
		const yEndstop = yEndstops.data?.find((e) => e.id === printer.defaults.yEndstop);

		if (board) {
			setSelectedBoard(board);
		}

		if (toolboard) {
			const _toolboard = Toolboard.safeParse(toolboard);
			if (_toolboard.success) {
				setSelectedToolboard(_toolboard.data);
			}
		}

		if (hotend) {
			setSelectedHotend(hotend);
		}

		if (extruder) {
			setSelectedExtruder(extruder);
		}

		if (thermistor) {
			setSelectedThermistor(thermistor);
		}

		if (probe) {
			setSelectedProbe(probe);
		}

		if (xEndstop) {
			setSelectedXEndstop(xEndstop);
		}

		if (yEndstop) {
			setSelectedYEndstop(yEndstop);
		}
	};

	const parsedPrinterConfiguration = PrinterConfiguration.safeParse({
		controlboard: selectedBoard,
		toolboard: selectedToolboard,
		printer: selectedPrinter,
		hotend: selectedHotend,
		extruder: selectedExtruder,
		thermistor: selectedThermistor,
		probe: selectedProbe,
		xEndstop: selectedXEndstop,
		yEndstop: selectedYEndstop,
		size: selectedPrinterOption,
	});

	const queryErrors: string[] = [];
	if (hotends.error) {
		queryErrors.push(hotends.error.message);
	}
	if (extruders.error) {
		queryErrors.push(extruders.error.message);
	}
	if (thermistors.error) {
		queryErrors.push(thermistors.error.message);
	}
	if (probes.error) {
		queryErrors.push(probes.error.message);
	}
	if (xEndstops.error) {
		queryErrors.push(xEndstops.error.message);
	}
	if (yEndstops.error) {
		queryErrors.push(yEndstops.error.message);
	}
	if (boards.error) {
		queryErrors.push(boards.error.message);
	}

	return {
		queryErrors,
		selectedPrinter,
		setSelectedPrinter,
		selectedPrinterOption,
		setSelectedPrinterOption,
		selectedHotend,
		setSelectedHotend,
		selectedExtruder,
		setSelectedExtruder,
		selectedThermistor,
		setSelectedThermistor,
		selectedProbe,
		setSelectedProbe,
		selectedXEndstop,
		setSelectedXEndstop,
		selectedYEndstop,
		setSelectedYEndstop,
		hotends,
		extruders,
		thermistors,
		probes,
		xEndstops,
		yEndstops,
		setPrinterDefaults,
		printerConfiguration,
		parsedPrinterConfiguration,
		isReady:
			hotends.data != null &&
			hotends.data != null &&
			extruders.data != null &&
			thermistors.data != null &&
			probes.data != null &&
			xEndstops.data != null &&
			yEndstops.data != null &&
			boards.data != null,
	};
};