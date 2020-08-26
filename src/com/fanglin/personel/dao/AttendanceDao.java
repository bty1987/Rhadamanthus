package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.AttendancePO;

public interface AttendanceDao extends Dao<AttendancePO> {

	public List<AttendancePO> queryAttendance(Integer uid, Integer month);
	
	public List<?> queryList(Integer uid, Integer month);
}
