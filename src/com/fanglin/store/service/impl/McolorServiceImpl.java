package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.McolorDao;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.po.McolorPO;
import com.fanglin.store.service.McolorService;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.utils.BeanUtil;

@Service("mcolorsService")
@Transactional(readOnly = true)
public class McolorServiceImpl implements McolorService{
	
	@Autowired
	private McolorDao mcolorDao;
	
	@Autowired
	private MgoodsDao mgoodsDao;
	
	@Override
	public List<McolorVO> queryMcolorByGid(McolorVO mcolor) {
		
		List<McolorPO> mcolorPOs = mcolorDao.queryMcolorByGid(mcolor.getMgoods().getGid(), false);
		
		List<McolorVO> mcolorVOs = new ArrayList<McolorVO>();
		
			McolorVO mcolorVO;
			
			for(McolorPO mcolorPO : mcolorPOs){

				mcolorVO = new McolorVO(new MgoodsVO());
				
				BeanUtil.copyProperties(mcolorPO, mcolorVO, Arrays.asList("mgoods"));
				
				BeanUtil.copyProperties(mcolorPO.getMgoods(), mcolorVO.getMgoods(), Arrays.asList("mbrand"));
				
				mcolorVOs.add(mcolorVO);
		}

		return mcolorVOs;
	}
	
	@Override
	public List<McolorVO> queryMcolorByGidAndStatus(McolorVO mcolor) {
		
		List<McolorPO> mcolorPOs = mcolorDao.queryMcolorByGid(mcolor.getMgoods().getGid(), true);
		
		List<McolorVO> mcolorVOs = new ArrayList<McolorVO>();
		
			McolorVO mcolorVO;
			
			for(McolorPO mcolorPO : mcolorPOs){

				mcolorVO = new McolorVO(new MgoodsVO());
				
				BeanUtil.copyProperties(mcolorPO, mcolorVO, Arrays.asList("mgoods"));
				
				BeanUtil.copyProperties(mcolorPO.getMgoods(), mcolorVO.getMgoods(), Arrays.asList("mbrand"));
				
				mcolorVOs.add(mcolorVO);
		}

		return mcolorVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMcolor(McolorVO mcolorVO) throws FLException{
		
		List<McolorPO> mcolorPOs = mcolorDao.queryMcolorByGid(mcolorVO.getMgoods().getGid(), false);
		
		for (McolorPO mcolorPO : mcolorPOs) {
			if(mcolorPO.getColor().equals(mcolorVO.getColor())){
				throw new FLException(260034 , "颜色已存在");
			}
		}
		
		McolorPO mcolorPO = new McolorPO();
		
		mcolorPO.setMgoods(mgoodsDao.get(mcolorVO.getMgoods().getGid()));
		
		mcolorPO.setColor(mcolorVO.getColor());
		
		mcolorPO.setStatus(McolorPO.STATUS_ABLE_SHORT);
		
		mcolorDao.save(mcolorPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMcolor(McolorVO mcolorVO) throws FLException{
		
		McolorPO mcolorPO = mcolorDao.get(mcolorVO.getCid());
		
		if(mcolorPO == null){
			throw new FLException(260014, "颜色不存在");
		}
		
		BeanUtil.copyProperties(mcolorVO, mcolorPO, Arrays.asList("goods", "status"));
		
		mcolorDao.update(mcolorPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMcolorForStatus(McolorVO mcolorVO) throws FLException {
		
		McolorPO mcolorPO = mcolorDao.get(mcolorVO.getCid());
		
		if(mcolorPO == null){
			throw new FLException(260014, "颜色不存在");
		}
		
		mcolorPO.setStatus(mcolorVO.getStatus());
		
		mcolorDao.update(mcolorPO);
		
	}
	
}
