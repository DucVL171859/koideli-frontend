import React, { useEffect, useState } from "react";
import {
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    Grid,
} from "@mui/material";
import MainCard from "components/MainCard";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import deliveryServices from "services/deliveryServices";
import { toast } from "react-toastify";
import ExistingTimelines from "pages/manager/ExistingTimeline";

const Timeline = () => {
    const [timelines, setTimelines] = useState([]);
    const [selectedTimelineId, setSelectedTimelineId] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    useEffect(() => {
        fetchTimelines();
    }, []);

    const fetchTimelines = async () => {
        try {
            let res = await timelineDeliveryServices.getTimelineDeliveryEnable();
            if (res) {
                setTimelines(res.data.data);
            }
        } catch (error) {
            console.log("Error fetching timelines", error);
        }
    };

    const handleTimelineSelect = (event) => {
        setSelectedTimelineId(Number(event.target.value));
    };

    const handleOpenConfirmDialog = () => {
        if (selectedTimelineId) {
            setConfirmDialogOpen(true);
        } else {
            toast.error("Please select a timeline to update.");
        }
    };

    const handleUpdateTimelineStatus = async () => {
        try {
            let res = await deliveryServices.updateTimelineDelivery(selectedTimelineId);
            if (res) {
                toast.success("Timeline status updated successfully!");
                setConfirmDialogOpen(false);
                fetchTimelines(); // Refresh timelines after updating
            } else {
                toast.error("Failed to update timeline status.");
            }
        } catch (error) {
            console.log("Error updating timeline status", error);
        }
    };

    return (
        <>
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to update the status of the selected timeline?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleUpdateTimelineStatus} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

            <MainCard sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={600}>Existing Timelines</Typography>
                <ExistingTimelines />
            </MainCard>
        </>
    );
};

export default Timeline;
