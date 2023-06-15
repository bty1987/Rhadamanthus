package com.fanglin.report.service.impl;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.report.dao.DecorationReportDao;
import com.fanglin.report.po.DecorationAchievementPO;
import com.fanglin.report.po.DecorationReportPO;
import com.fanglin.report.service.DecorationReportService;
import com.fanglin.report.vo.DecorationAchievementVO;
import com.fanglin.report.vo.DecorationReportVO;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("DecorationReportService")
@Transactional(readOnly = true)
public class DecorationReportServiceImpl implements DecorationReportService {

	@Autowired
	private DecorationReportDao decorationReportDao;

	@Override
	public void queryDecoration7Construction(Paging paging, List<Filter> list) throws FLException {

		List<DecorationReportPO> decorationReportPOs = decorationReportDao.queryDecoration7Construction(paging, list);
		List<DecorationReportVO> decorationReportVOs = new ArrayList<DecorationReportVO>();
		DecorationReportVO decorationReportVO;

		for (DecorationReportPO decorationReportPO : decorationReportPOs) {

			decorationReportVO = new DecorationReportVO();
			BeanUtil.copyProperties(decorationReportPO, decorationReportVO, Arrays.asList("company"));
			decorationReportVO.setCompany(decorationReportPO.getCompany().getName());

			decorationReportVOs.add(decorationReportVO);
		}

		paging.setData(decorationReportVOs);

	}

	@Override
	public void queryDecoration7Achievement(Paging paging, List<Filter> list, int company) throws FLException {

		List<DecorationAchievementPO> decorationAchievementPOs = decorationReportDao.queryDecoration7Achievement(paging, list, company);
		List<DecorationAchievementVO> decorationAchievementVOs = new ArrayList<DecorationAchievementVO>();
		DecorationAchievementVO decorationAchievementVO;

		for (DecorationAchievementPO decorationAchievementPO : decorationAchievementPOs) {

			decorationAchievementVO = new DecorationAchievementVO(new DepartmentVO());
			BeanUtil.copyProperties(decorationAchievementPO, decorationAchievementVO, Arrays.asList("department"));
			BeanUtil.copyProperties(decorationAchievementPO.getDepartment(), decorationAchievementVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));

			decorationAchievementVOs.add(decorationAchievementVO);
		}

		paging.setData(decorationAchievementVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecoration7Construction() throws Exception {

		List<Object[]> decorationConstruction = (List<Object[]>) decorationReportDao.countDecorationForConstruction();
		List<Integer> year = Arrays.asList(new Integer[] { 2015, 2016, 2017, 2018, 2019, 2020 });
		List<Short> designStatus = Arrays.asList(new Short[] { DecorationPO.DESIGNSTATUS_CONDUCT_INT, DecorationPO.DESIGNSTATUS_END_INT });

		decorationConstruction.addAll(decorationReportDao.countDecorationForContract(year));

		decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(0, 30, 20)); // 20. 付款比例30% min:最小区间值 max:最大区间值 type:映射属性类型
		decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(31, 64, 21)); // 21. 付款比例65%
		decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(65, 97, 22)); // 22. 付款比例97%
		decorationConstruction.addAll(decorationReportDao.countDecorationForPaySacle(98, 200, 23));// 23. 付款比例100%

		decorationConstruction.addAll(decorationReportDao.countDecorationForDesignStatus(designStatus));// 装修单设计状态 24.设计中 25.完成
		decorationConstruction.addAll(decorationReportDao.countDecorationForDeposit(DecorationPO.STATUS_DEPOSIT_INT));// 定金数

		decorationReportDao.truncateDecoration7Construction();

		Map<Integer, DecorationReportPO> decorationReportPOs = new HashMap<Integer, DecorationReportPO>();

		for (int i = 0; i < decorationConstruction.size(); i++) {

			Integer company = (Integer) decorationConstruction.get(i)[0];

			if (!decorationReportPOs.containsKey(company)) {
				decorationReportPOs.put(company, new DecorationReportPO(new CompanyPO()));
			}

			DecorationReportPO decorationReportPO = decorationReportPOs.get(company);
			Class<?> clazz = decorationReportPO.getClass();

			Method method = clazz.getMethod("setCs" + decorationConstruction.get(i)[1], int.class);
			method.invoke(decorationReportPO, decorationConstruction.get(i)[2]);
			decorationReportPO.setCompany(new CompanyPO(company));

			decorationReportDao.saveOrUpdate(decorationReportPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecoration7Achievement(DecorationAchievementVO decorationAchievement, int company) throws Exception {

		int year = decorationAchievement.getYear();
		int month = decorationAchievement.getMonth();
		String time = String.valueOf(year) + "-" + String.valueOf(month);
		String startTime = DateUtil.getDateToDateString(DateUtil.getFirstDay(DateUtil.parseDate(time, "yyyy-MM")), "yyyy-MM-dd") + " 00:00:00";
		String endTime = DateUtil.getDateToDateString(DateUtil.getLastDay(DateUtil.parseDate(time, "yyyy-MM")), "yyyy-MM-dd") + " 23:59:59";

		List<Object[]> decorationConstruction1 = (List<Object[]>) decorationReportDao.countDecorationForAchievement1(startTime, endTime, company);
		List<Object[]> decorationConstruction2 = (List<Object[]>) decorationReportDao.countDecorationForAchievement2(startTime, endTime, company);
		List<Object[]> decorationConstruction3 = (List<Object[]>) decorationReportDao.countDecorationForAchievement3(startTime, endTime, company);
		List<Object[]> decorationConstruction4 = (List<Object[]>) decorationReportDao.countDecorationForAchievement4(startTime, endTime, company);

		Map<String, DecorationAchievementPO> decorationAchievementPOs1 = new HashMap<String, DecorationAchievementPO>();

		for (int i = 0; i < decorationConstruction1.size(); i++) {

			Integer did = (Integer) decorationConstruction1.get(i)[0];
			Short typeness = (Short) decorationConstruction1.get(i)[1];

			String key = String.valueOf(did) + String.valueOf(typeness);

			decorationAchievementPOs1.put(key, new DecorationAchievementPO(new DepartmentPO()));

			DecorationAchievementPO decorationAchievementPO = decorationAchievementPOs1.get(key);

			decorationAchievementPO.setDepartment(new DepartmentPO(did));
			decorationAchievementPO.setTypeness(typeness);// 类型
			decorationAchievementPO.setCs0((Long) decorationConstruction1.get(i)[2]);// 签单数
			decorationAchievementPO.setCs2((Long) decorationConstruction1.get(i)[3]);// 签单额
			decorationAchievementPO.setCs3((Long) decorationConstruction1.get(i)[4]);// 净业绩
		}

		for (int i = 0; i < decorationConstruction2.size(); i++) {

			Integer did = (Integer) decorationConstruction2.get(i)[0];
			Short typeness = (Short) decorationConstruction2.get(i)[1];

			String key = String.valueOf(did) + String.valueOf(typeness);

			if (!decorationAchievementPOs1.containsKey(key)) {
				decorationAchievementPOs1.put(key, new DecorationAchievementPO(new DepartmentPO()));
			}

			DecorationAchievementPO decorationAchievementPO = decorationAchievementPOs1.get(key);

			decorationAchievementPO.setDepartment(new DepartmentPO(did));
			decorationAchievementPO.setTypeness(typeness);// 类型
			decorationAchievementPO.setCs1((Long) decorationConstruction2.get(i)[2]);// 设计数
			decorationAchievementPO.setCs4((Long) decorationConstruction2.get(i)[3]);// 设计额
		}

		for (int i = 0; i < decorationConstruction3.size(); i++) {

			Integer did = (Integer) decorationConstruction3.get(i)[0];
			Short typeness = (Short) decorationConstruction3.get(i)[1];

			String key = String.valueOf(did) + String.valueOf(typeness);

			if (!decorationAchievementPOs1.containsKey(key)) {
				decorationAchievementPOs1.put(key, new DecorationAchievementPO(new DepartmentPO()));
			}

			DecorationAchievementPO decorationAchievementPO = decorationAchievementPOs1.get(key);

			decorationAchievementPO.setDepartment(new DepartmentPO(did));
			decorationAchievementPO.setTypeness(typeness);// 类型
			decorationAchievementPO.setCs5((Long) decorationConstruction3.get(i)[2]);// 服务费
		}

		for (int i = 0; i < decorationConstruction4.size(); i++) {

			Integer did = (Integer) decorationConstruction4.get(i)[0];
			Short typeness = (Short) decorationConstruction4.get(i)[1];

			String key = String.valueOf(did) + String.valueOf(typeness);

			if (!decorationAchievementPOs1.containsKey(key)) {
				decorationAchievementPOs1.put(key, new DecorationAchievementPO(new DepartmentPO()));
			}

			DecorationAchievementPO decorationAchievementPO = decorationAchievementPOs1.get(key);

			decorationAchievementPO.setDepartment(new DepartmentPO(did));
			decorationAchievementPO.setTypeness(typeness);// 类型
			decorationAchievementPO.setCs6((Long) decorationConstruction4.get(i)[2]);// 未签单设计户数
			decorationAchievementPO.setCs7((Long) decorationConstruction4.get(i)[3]);// 未签单设计费
		}

		for (Entry<String, DecorationAchievementPO> entry : decorationAchievementPOs1.entrySet()) {

			decorationReportDao.updataDecoration7Achievement(entry.getValue().getDepartment().getDid(), year, month, entry.getValue().getTypeness(), entry.getValue().getCs0(), entry.getValue().getCs1(), entry.getValue().getCs2(), entry.getValue().getCs3(), entry.getValue().getCs4(), entry.getValue().getCs5(), entry.getValue().getCs6(), entry.getValue().getCs7(), company);
		}

	}
}
