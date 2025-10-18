package com.project.mhotel.controller;

import com.project.mhotel.entity.Room;
import com.project.mhotel.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/hotels")
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public String listHotels(Model model) {
        model.addAttribute("hotels", hotelService.getAllHotels());
        return "hotel/list"; // thymeleaf view
    }

    // Form thêm phòng cho khách sạn
    @GetMapping("/{hotelId}/rooms/add")
    public String showAddRoomForm(@PathVariable Long hotelId, Model model) {
        model.addAttribute("hotelId", hotelId);
        model.addAttribute("room", new Room());
        return "room/add";
    }

    @PostMapping("/{hotelId}/rooms/add")
    public String addRoomToHotel(@PathVariable Long hotelId, @ModelAttribute Room room) {
        hotelService.addRoomToHotel(hotelId, room);
        return "redirect:/hotels/" + hotelId + "/rooms";
    }

    @GetMapping("/{hotelId}/rooms")
    public String listRoomsByHotel(@PathVariable Long hotelId, Model model) {
        model.addAttribute("rooms", hotelService.getRoomsByHotel(hotelId));
        model.addAttribute("hotelId", hotelId);
        return "room/list";
    }
}
