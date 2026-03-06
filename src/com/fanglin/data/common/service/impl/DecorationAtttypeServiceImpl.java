package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationAtttypeDao;
import com.fanglin.data.common.service.DecorationAtttypeService;
import com.fanglin.data.common.vo.DecorationAtttypeVO;
import com.fanglin.data.po.DecorationAtttypePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationAtttypeService")
@Transactional(readOnly = true)
public class DecorationAtttypeServiceImpl implements DecorationAtttypeService {

	@Autowired
	private DecorationAtttypeDao decorationAtttypeDao;

	@Override
	public void pageDecorationAtttype(Paging paging, List<Filter> filters, int company) {

		List<DecorationAtttypePO> decorationAtttypePOs = decorationAtttypeDao.pageDecorationAtttype(paging, filters, company);
		List<DecorationAtttypeVO> decorationAtttypeVOs = new ArrayList<DecorationAtttypeVO>();

		for (DecorationAtttypePO decorationAtttypePO : decorationAtttypePOs) {
			DecorationAtttypeVO decorationAtttypeVO = new DecorationAtttypeVO();

			BeanUtil.copyPropertie(decorationAtttypePO, decorationAtttypeVO);

			decorationAtttypeVOs.add(decorationAtttypeVO);
		}

		paging.setData(decorationAtttypeVOs);
	}

	@Override
	public List<DecorationAtttypeVO> queryDecorationAtttype(int company) {

		List<DecorationAtttypePO> decorationAtttypePOs = decorationAtttypeDao.queryDecorationAtttype(company);
		List<DecorationAtttypeVO> decorationAtttypeVOs = new ArrayList<DecorationAtttypeVO>();

		for (DecorationAtttypePO decorationAtttypePO : decorationAtttypePOs) {
			DecorationAtttypeVO decorationAtttypeVO = new DecorationAtttypeVO();

			BeanUtil.copyPropertie(decorationAtttypePO, decorationAtttypeVO);

			decorationAtttypeVOs.add(decorationAtttypeVO);
		}
		return decorationAtttypeVOs;
	}

	@Override
	public DecorationAtttypeVO queryDecorationAtttype(DecorationAtttypeVO decorationAtttypeVO, int company) {

		DecorationAtttypePO decorationAtttypePO = decorationAtttypeDao.queryDecorationAtttype(decorationAtttypeVO.getType(), company);

		if (decorationAtttypePO != null) {
			decorationAtttypeVO = new DecorationAtttypeVO();
			BeanUtil.copyPropertie(decorationAtttypePO, decorationAtttypeVO);
			return decorationAtttypeVO;
		}

		return null;
	}

	@Override
	@Transactional(readOnly = false)
	public void updateDecorationAtttype(long daid, short manageDiscount, short taxDiscount) {
		decorationAtttypeDao.updateDecorationAtttype(daid, manageDiscount, taxDiscount);
	}

}
