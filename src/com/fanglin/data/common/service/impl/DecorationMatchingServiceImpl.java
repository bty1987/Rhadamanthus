package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationMatchingDao;
import com.fanglin.data.common.service.DecorationMatchingService;
import com.fanglin.data.common.vo.DecorationMatchingVO;
import com.fanglin.data.po.DecorationMatchingPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationMatchingService")
@Transactional(readOnly = true)
public class DecorationMatchingServiceImpl implements DecorationMatchingService {

	@Autowired
	private DecorationMatchingDao decorationMatchingDao;

	@Override
	public List<DecorationMatchingVO> pageDecorationMatching(Paging paging, List<Filter> filters, int company) {

		List<DecorationMatchingPO> decorationMatchingPOs = decorationMatchingDao.pageDecorationMatching(paging, filters, company);
		List<DecorationMatchingVO> decorationMatchingVOs = new ArrayList<DecorationMatchingVO>();

		DecorationMatchingVO decorationMatchingVO;

		for (DecorationMatchingPO decorationMatchingPO : decorationMatchingPOs) {

			decorationMatchingVO = new DecorationMatchingVO();

			BeanUtil.copyProperties(decorationMatchingPO, decorationMatchingVO);

			decorationMatchingVOs.add(decorationMatchingVO);
		}

		paging.setData(decorationMatchingVOs);

		return decorationMatchingVOs;
	}

	@Override
	public List<DecorationMatchingVO> queryDecorationMatching(List<Short> type, List<Short> typeness, int company) throws FLException {

		List<DecorationMatchingVO> decorationMatchingVOs = new ArrayList<DecorationMatchingVO>();

		if (type == null && typeness == null) return decorationMatchingVOs;

		List<DecorationMatchingPO> decorationMatchingPOs = decorationMatchingDao.queryDecorationMatching(type, typeness, company);

		DecorationMatchingVO decorationMatchingVO;

		for (DecorationMatchingPO decorationMatchingPO : decorationMatchingPOs) {

			decorationMatchingVO = new DecorationMatchingVO();

			BeanUtil.copyProperties(decorationMatchingPO, decorationMatchingVO);

			decorationMatchingVOs.add(decorationMatchingVO);
		}

		return decorationMatchingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addDecorationMatching(DecorationMatchingVO decorationMatchingVO, int company) throws FLException {

		DecorationMatchingPO decorationMatchingPO = new DecorationMatchingPO();

		BeanUtil.copyProperties(decorationMatchingVO, decorationMatchingPO);

		decorationMatchingPO.setCompany(company);

		decorationMatchingDao.save(decorationMatchingPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationMatching(DecorationMatchingVO decorationMatchingVO, int company) throws FLException {

		DecorationMatchingPO decorationMatchingPO = decorationMatchingDao.get(decorationMatchingVO.getDmid());

		if (decorationMatchingPO == null) {
			throw new FLException(130039, "装修配比不存在");
		}

		BeanUtil.copyProperties(decorationMatchingVO, decorationMatchingPO);

		decorationMatchingDao.update(decorationMatchingPO);
	}
}
