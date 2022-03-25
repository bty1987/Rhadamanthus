package com.fanglin.customer.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.service.DecorationHolonomyService;
import com.fanglin.customer.vo.DecorationHolonomyVO;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.utils.BeanUtil;

@Service("decorationHolonomyOrderService")
@Transactional(readOnly = true)
public class DecorationHolonomyServiceImpl implements DecorationHolonomyService {

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Override
	public DecorationHolonomyVO queryCusDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO) {

		DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(decorationHolonomyVO.getOrderId());

		decorationHolonomyVO = new DecorationHolonomyVO();

		if (decorationHolonomyPO != null) {

			BeanUtil.copyPropertie(decorationHolonomyPO, decorationHolonomyVO, Arrays.asList("decoration"));

		}

		return decorationHolonomyVO;
	}

}
