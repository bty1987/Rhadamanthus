package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.McolorDao;
import com.fanglin.store.po.McolorPO;
import com.fanglin.store.service.McolorService;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.utils.BeanUtil;

@Service("mcolorsService")
@Transactional(readOnly = true)
public class McolorServiceImpl implements McolorService{
	
	@Autowired
	private McolorDao mcolorDao;
	
	@Override
	public List<McolorVO> queryMcolorByGid(McolorVO mcolor) {
		
		List<McolorPO> mcolorPOs = mcolorDao.queryMcolorByGid(mcolor.getGid(), mcolor.getStatus());
		
		List<McolorVO> mcolorVOs = new ArrayList<McolorVO>();
		
		McolorVO mcolorVO;
		
		for(McolorPO mcolorPO : mcolorPOs){

			mcolorVO = new McolorVO();
			
			BeanUtil.copyProperties(mcolorPO, mcolorVO);
			
			mcolorVOs.add(mcolorVO);
	}

		return mcolorVOs;
	}
	
	@Override
	public List<McolorVO> queryMcolor(McolorVO mcolor) {
		
		List<McolorPO> mcolorPOs = mcolorDao.queryMcolorByGid(mcolor.getGid(), McolorPO.STATUS_ABLE_SHORT);
		
		List<McolorVO> mcolorVOs = new ArrayList<McolorVO>();
		
		McolorVO mcolorVO;
		
		for(McolorPO mcolorPO : mcolorPOs){

			mcolorVO = new McolorVO();
			
			BeanUtil.copyProperties(mcolorPO, mcolorVO);
			
			mcolorVOs.add(mcolorVO);
	}

		return mcolorVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMcolor(McolorVO mcolorVO) throws FLException{
		
		McolorPO mcolorPO = new McolorPO();
		
		BeanUtil.copyProperties(mcolorVO, mcolorPO);
		
		mcolorPO.setStatus(McolorPO.STATUS_ABLE_SHORT);
		
		mcolorDao.save(mcolorPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMcolorForStatus(McolorVO mcolorVO) throws FLException {
		
		McolorPO mcolorPO = mcolorDao.get(mcolorVO.getCid());
		
		if(mcolorPO == null){
			throw new FLException(340006, "颜色不存在");
		}
		
		mcolorPO.setStatus(mcolorVO.getStatus());
		
		mcolorDao.update(mcolorPO);
		
	}
	
}
