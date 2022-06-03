package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ChatingDao;
import com.fanglin.data.common.service.ChatingService;
import com.fanglin.data.common.vo.ChatingVO;
import com.fanglin.data.po.ChatingPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("chatingService")
@Transactional(readOnly = true)
public class ChatingServiceImpl implements ChatingService {

	@Autowired
	private ChatingDao chatingDao;

	@Override
	public void pageChating(Paging paging, List<Filter> filters, int company) {

		List<ChatingPO> chatingPOs = chatingDao.pageChating(paging, filters, company);
		List<ChatingVO> chatingVOs = new ArrayList<ChatingVO>();

		for (ChatingPO chatingPO : chatingPOs) {
			ChatingVO chatingVO = new ChatingVO();

			BeanUtil.copyProperties(chatingPO, chatingVO);

			chatingVOs.add(chatingVO);
		}
		paging.setData(chatingVOs);
	}

	@Override
	public List<ChatingVO> queryChating(int company) throws FLException {

		List<ChatingPO> chatingPOs = chatingDao.queryChating(company);
		List<ChatingVO> chatingVOs = new ArrayList<ChatingVO>();

		for (ChatingPO chatingPO : chatingPOs) {

			ChatingVO chatingVO = new ChatingVO();

			BeanUtil.copyProperties(chatingPO, chatingVO);

			chatingVOs.add(chatingVO);
		}

		return chatingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addChating(ChatingVO chatingVO, int company) {

		ChatingPO chatingPO = new ChatingPO();

		BeanUtil.copyProperties(chatingVO, chatingPO);

		chatingPO.setCompany(company);
		chatingDao.save(chatingPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateChating(ChatingVO chatingVO) throws FLException {
		ChatingPO chatingPO = chatingDao.get(chatingVO.getCid());

		if (chatingPO == null) {
			throw new FLException(130101, "话术不存在");
		}

		BeanUtil.copyProperties(chatingVO, chatingPO);

		chatingDao.update(chatingPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateChatingForStatus(ChatingVO chatingVO) throws FLException {

		ChatingPO chatingPO = chatingDao.get(chatingVO.getCid());

		if (chatingPO == null) {
			throw new FLException(130101, "话术不存在");
		}

		chatingPO.setStatus(chatingVO.getStatus());

		chatingDao.update(chatingPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteChating(ChatingVO chatingVO) {
		ChatingPO chatingPO = chatingDao.get(chatingVO.getCid());

		chatingDao.delete(chatingPO);

		return 0;

	}

}
