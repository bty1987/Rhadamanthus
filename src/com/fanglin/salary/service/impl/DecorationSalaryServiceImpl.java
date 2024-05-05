package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.DecorationSalaryDao;
import com.fanglin.salary.po.DecorationSalaryPO;
import com.fanglin.salary.service.DecorationSalaryService;
import com.fanglin.salary.vo.DecorationSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationSalaryService")
@Transactional(readOnly = true)
public class DecorationSalaryServiceImpl implements DecorationSalaryService {

	@Autowired
	private DecorationSalaryDao decorationSalaryDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageDecorationSalary(Paging paging, List<Filter> filters, DecorationSalaryVO decorationSalaryVO) throws FLException {

		if (decorationSalaryVO == null) {
			decorationSalaryVO = new DecorationSalaryVO();
		}

		if (decorationSalaryVO.getBelonger() != null) {
			filters.add(new Filter("userId", decorationSalaryVO.getBelonger().getUserId(), "eq"));
		}

		if (decorationSalaryVO.getCreateTime() != null) {

			String start = DateUtil.getDateToDateString(DateUtil.getFirstDay(DateUtil.getTimestampToDate(decorationSalaryVO.getCreateTime())), "yyyy/MM/dd");
			String end = DateUtil.getDateToDateString(DateUtil.getLastDay(DateUtil.getTimestampToDate(decorationSalaryVO.getCreateTime())), "yyyy/MM/dd");

			filters.add(new Filter("createTime", String.format("%s-%s", start, end), "eq"));
		}

		List<DecorationSalaryPO> decorationSalaryPOs = decorationSalaryDao.pageDecorationSalary(paging, filters);
		List<DecorationSalaryVO> decorationSalaryVOs = new ArrayList<DecorationSalaryVO>();

		for (DecorationSalaryPO decorationSalaryPO : decorationSalaryPOs) {

			decorationSalaryVO = new DecorationSalaryVO(new DecorationVO(), new UserBaseVO());

			BeanUtil.copyProperties(decorationSalaryPO, decorationSalaryVO, Arrays.asList("decoration", "belonger"));

			decorationSalaryVO.getBelonger().setBaseInfo(decorationSalaryPO.getBelonger());

			if (decorationSalaryPO.getDecoration() != null) decorationSalaryPO.getDecoration().ptvcascade(decorationSalaryVO.getDecoration());

			decorationSalaryVOs.add(decorationSalaryVO);
		}
		paging.setData(decorationSalaryVOs);
	}
}
