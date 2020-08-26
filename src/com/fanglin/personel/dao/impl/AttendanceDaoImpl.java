package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.AttendanceDao;
import com.fanglin.personel.po.AttendancePO;

@Repository("AttendanceDao")
public class AttendanceDaoImpl extends DaoImpl<AttendancePO> implements AttendanceDao {
	
	public AttendanceDaoImpl() {
		super(AttendancePO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AttendancePO> queryAttendance(Integer uid, Integer month) {
		
		return session().createCriteria(AttendancePO.class).add(Restrictions.eq("uid", uid)).add(Restrictions.eq("month", month)).list();
	}

	@Override
	public List<?> queryList(Integer uid, Integer month) {
		
		Integer monthSub = null;
		
		if (Integer.parseInt(String.valueOf(month).substring(4, 6)) == 1) {
			monthSub = Integer.parseInt(Integer.parseInt(String.valueOf(month).substring(0, 4)) - 1 + "11");
		}else if (Integer.parseInt(String.valueOf(month).substring(4, 6)) == 2) {
			monthSub = Integer.parseInt(Integer.parseInt(String.valueOf(month).substring(0, 4)) - 1 + "12");
		}else {
			monthSub = month - 2;
		}
		
		String sql = "select * from communion.attendance where uid=:uid and month BETWEEN :monthsub and :month ORDER BY `month`";

		return session().createSQLQuery(sql).setLong("uid", uid).setInteger("monthsub", monthSub).setInteger("month", month).list();
	}

}
