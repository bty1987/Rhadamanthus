package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.TalkingDao;
import com.fanglin.data.common.service.TalkingService;
import com.fanglin.data.common.vo.TalkingVO;
import com.fanglin.data.po.TalkingPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("talkingService")
@Transactional(readOnly = true)
public class TalkingServiceImpl implements TalkingService {

	@Autowired
	private TalkingDao talkingDao;


	@Override
	public void pageTalking(Paging paging, List<Filter> filters, int company) {

		List<TalkingPO> talkingPOs = talkingDao.pageTalking(paging, filters, company);
		List<TalkingVO> talkingVOs = new ArrayList<TalkingVO>();
		TalkingVO talkingVO;

		for (TalkingPO talkingPO : talkingPOs) {

			talkingVO = new TalkingVO();

			BeanUtil.copyProperties(talkingPO, talkingVO);

			talkingVOs.add(talkingVO);
		}

		paging.setData(talkingVOs);
	}

	@Override
	public List<TalkingVO> queryTalking(List<Short> types, int company) {
		
		List<TalkingPO> talkingPOs = talkingDao.queryTalking(types, company);
		List<TalkingVO> talkingVOs = new ArrayList<TalkingVO>();
		TalkingVO talkingVO;

		for (TalkingPO talKingPO : talkingPOs) {

			talkingVO = new TalkingVO();

			BeanUtil.copyProperties(talKingPO, talkingVO);

			talkingVOs.add(talkingVO);
		}

		return talkingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addTalking(TalkingVO talkingVO, int company) throws FLException {
		
		TalkingPO talkingPO = new TalkingPO();
		
		BeanUtil.copyProperties(talkingVO, talkingPO);
		talkingPO.setCompany(company);
		talkingPO.setStatus(TalkingPO.STATUS_ENABLE_SHORT);
		
		talkingDao.save(talkingPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTalking(TalkingVO talkingVO) throws FLException {
		
		TalkingPO talkingPO = talkingDao.get(talkingVO.getTid());
		
		if (talkingPO == null) {
			throw new FLException(130040, "话术不存在");
		}
		
		talkingPO.setName(talkingVO.getName());
		talkingPO.setType(talkingVO.getType());
		talkingPO.setContent(talkingVO.getContent());
		
		talkingDao.update(talkingPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateTalkingForStatus(TalkingVO talkingVO) throws FLException {
		
		TalkingPO talkingPO = talkingDao.get(talkingVO.getTid());
		
		if (talkingPO == null) {
			throw new FLException(130040, "话术不存在");
		}
		
		talkingPO.setStatus(talkingVO.getStatus());
		
		talkingDao.update(talkingPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteTalking(TalkingVO talkingVO) throws FLException {
		
		TalkingPO talkingPO = talkingDao.get(talkingVO.getTid());
		
		if (talkingPO == null) {
			throw new FLException(130040, "话术不存在");
		}
		
		talkingDao.delete(talkingPO);
		
		return 0;
	}

}
