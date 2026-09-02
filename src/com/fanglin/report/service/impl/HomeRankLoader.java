package com.fanglin.report.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.dao.HomeRankDao;
import com.fanglin.report.service.HomeRankService;

/**
 * 首页排名查询执行器：事务边界收敛于本类。
 *
 * <p>single-flight 等待中的请求不经过本类，因此不占用数据库连接；
 * 仅执行者请求在 {@link #queryHomeRankForTop} 内短暂开启事务完成聚合查询。
 */
@Service("homeRankLoader")
public class HomeRankLoader {

	private static final int TOP = 10;

	private static final long TEN_THOUSAND = 10000000L;

	@Autowired
	private HomeRankDao homeRankDao;

	@Transactional(rollbackFor = Exception.class)
	public List<TopVO> queryHomeRankForTop(short type, int month, int company) {

		if (type == HomeRankService.TYPE_SUPERVISOR_INT) {
			return toTops(homeRankDao.querySupervisorSiteRankForTop(pastYear(), TOP, company), false);
		}

		if (type == HomeRankService.TYPE_SALESMAN_INT) {
			return toTops(homeRankDao.querySalesmanSignRankForTop(monthStartTime(month), monthEndTime(month), TOP, company), true);
		}

		return toTops(homeRankDao.queryDesignerSignRankForTop(monthStartTime(month), monthEndTime(month), TOP, company), true);
	}

	private List<TopVO> toTops(List<Object[]> rows, boolean amount) {

		List<TopVO> tops = new ArrayList<TopVO>();

		for (Object[] row : rows) {

			TopVO top = new TopVO();
			top.setTopId((String) row[0]);
			top.setTopName((String) row[1]);
			top.setTopImg(row[2] == null ? "" : (String) row[2]);
			top.setTopValue(amount
					? BigDecimal.valueOf((Long) row[3]).divide(BigDecimal.valueOf(TEN_THOUSAND), 2, RoundingMode.HALF_UP).floatValue()
					: ((Number) row[3]).floatValue());

			tops.add(top);
		}

		return tops;
	}

	private String monthStartTime(int month) {
		return String.format("%04d-%02d-01", month / 100, month % 100);
	}

	private String monthEndTime(int month) {

		int year = month / 100;
		int mon = month % 100;

		if (mon == 12) {
			year++;
			mon = 1;
		} else {
			mon++;
		}

		return String.format("%04d-%02d-01", year, mon);
	}

	private String pastYear() {

		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.YEAR, -1);

		return new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime());
	}

}
