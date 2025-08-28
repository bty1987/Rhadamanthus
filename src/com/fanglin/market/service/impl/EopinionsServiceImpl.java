package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EopinionsDao;
import com.fanglin.market.po.EopinionsPO;
import com.fanglin.market.service.EopinionsService;
import com.fanglin.market.vo.EopinionsVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("eopinionsService")
@Transactional(readOnly = true)
public class EopinionsServiceImpl implements EopinionsService {

	@Autowired
	private EopinionsDao eopinionsDao;

	@Override
	public void pageEopinions(Paging paging, List<Filter> filters) {

		List<EopinionsPO> eopinionsPOs = eopinionsDao.pageEopinions(paging, filters);
		List<EopinionsVO> eopinionsVOs = new ArrayList<EopinionsVO>();

		for (EopinionsPO eopinionsPO : eopinionsPOs) {

			EopinionsVO eopinionsVO = new EopinionsVO();

			BeanUtil.copyPropertie(eopinionsPO, eopinionsVO);

			eopinionsVOs.add(eopinionsVO);
		}

		paging.setData(eopinionsVOs);
	}

	@Override
	public List<EopinionsVO> queryEopinionsByType(EopinionsVO eopinionsVO) {

		List<EopinionsPO> eopinionsPOs = eopinionsDao.queryEopinionsByType(eopinionsVO.getType());
		List<EopinionsVO> eopinionsVOs = new ArrayList<EopinionsVO>();

		for (EopinionsPO eopinionsPO : eopinionsPOs) {

			eopinionsVO = new EopinionsVO();

			BeanUtil.copyPropertie(eopinionsPO, eopinionsVO);

			eopinionsVOs.add(eopinionsVO);
		}

		return eopinionsVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addEopinion(EopinionsVO eopinionsVO) throws FLException {

		EopinionsPO eopinionsPO = new EopinionsPO();

		BeanUtil.copyProperties(eopinionsVO, eopinionsPO);

		eopinionsDao.save(eopinionsPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateEopinion(EopinionsVO eopinionsVO)  throws FLException {

		EopinionsPO eopinionsPO = this.eopinionsDao.get(eopinionsVO.getEcid());

		if (eopinionsPO == null) return;

		BeanUtil.copyProperties(eopinionsVO, eopinionsPO);

		eopinionsDao.update(eopinionsPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteEopinion(EopinionsVO eopinionsVO)  throws FLException {

		EopinionsPO eopinionsPO = eopinionsDao.get(eopinionsVO.getEcid());

		if (eopinionsPO == null) return;

		eopinionsDao.delete(eopinionsPO);
	}

}
