package com.fanglin.personel.service;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.personel.vo.AttendanceVO;

public interface AttendanceService {

	public List<AttendanceVO> queryAttendance(String userId);
	
	public JSONObject reportAttendance(String userId);
}
