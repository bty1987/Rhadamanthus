package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.personel.dao.AttendanceDao;
import com.fanglin.personel.po.AttendancePO;
import com.fanglin.personel.service.AttendanceService;
import com.fanglin.personel.vo.AttendanceVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;

@Service("AttendanceService")
@Transactional(readOnly = true)
public class AttendanceServiceImpl implements AttendanceService {

	@Autowired
	private AttendanceDao attendanceDao;
	
	@Override
	public List<AttendanceVO> queryAttendance(AttendanceVO attendanceVO) {
		
		List<AttendancePO> attendancePOs=attendanceDao.queryAttendance(attendanceVO.getUid(), attendanceVO.getMonth());
		List<AttendanceVO> attendanceVOs=new ArrayList<AttendanceVO>();
		
		for (AttendancePO attendancePO : attendancePOs) {
			
			attendanceVO=new AttendanceVO();
			BeanUtil.copyPropertie(attendancePO, attendanceVO);
			
			attendanceVOs.add(attendanceVO);
		}
		
		return attendanceVOs;
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public JSONObject reportAttendance(AttendanceVO attendanceVO){
	
		List<Object[]> attendaList = (List<Object[]>) attendanceDao.queryList(attendanceVO.getUid(), attendanceVO.getMonth());	
		
		JSONObject options = new JSONObject();
		JSONArray data = new JSONArray();
		
		int year = 0;
		int month = 0;
		
		int yearSmall = 0, monthSmall = 0; //范围: 最小月
		
		for(int i = 0; i< attendaList.size(); i++){

			year = Integer.parseInt(String.valueOf(attendaList.get(i)[2]).substring(0,4));
			month = Integer.parseInt(String.valueOf(attendaList.get(i)[2]).substring(4,6));
			
			format(data, attendaList.get(i), year, month);
			
		}
		
		if (Integer.parseInt(String.valueOf(attendanceVO.getMonth()).substring(4,6)) == 2) {
			
			yearSmall = Integer.parseInt(String.valueOf(attendanceVO.getMonth()).substring(0,4)) - 1;
			monthSmall = 12;
		}else if (Integer.parseInt(String.valueOf(attendanceVO.getMonth()).substring(4,6)) == 1) {
			
			yearSmall = Integer.parseInt(String.valueOf(attendanceVO.getMonth()).substring(0,4)) - 1;
			monthSmall = 11;
		}else{
		
			yearSmall = Integer.parseInt(String.valueOf(attendanceVO.getMonth()-2).substring(0,4));
			monthSmall = Integer.parseInt(String.valueOf(attendanceVO.getMonth()-2).substring(4,6));
		}
		
		int yearBig = Integer.parseInt(String.valueOf(attendanceVO.getMonth()).substring(0,4));
		int monthBig = Integer.parseInt(String.valueOf(attendanceVO.getMonth()).substring(4,6));
		
		options = (JSONObject)JSONObject.parse("{\"visualMap\": { \"show\": false, \"min\": 0, \"max\": 40}, \"calendar\": { \"range\": \"\", \"dayLabel\": { \"firstDay\": 1, \"nameMap\": \"cn\" }, \"monthLabel\": {\"nameMap\": \"cn\", }, }, \"series\": {\"type\": \"heatmap\", \"coordinateSystem\": \"calendar\", \"data\": \"\" }}");
	
		options.getJSONObject("series").put("data", data);
		options.getJSONObject("calendar").put("range", Arrays.asList(String.format("%d-%s-%s", yearSmall, FormatUtil.fillZero(monthSmall, "00"), "01"), String.format("%d-%s-%s", yearBig, FormatUtil.fillZero(monthBig, "00"), "31")));
		
		return options;
	}
	
	@SuppressWarnings("unchecked")
	private void format(JSONArray data, Object[] attendaList, int year, int month){
		
		for(int i=3;i<attendaList.length;i++){
			
			Integer value = (Integer) attendaList[i];
			
			data.add(Arrays.asList(String.format("%d-%s-%s", year, FormatUtil.fillZero(month, "00"), FormatUtil.fillZero(i-2, "00")), value)); 
			
		}
		
	}
}
