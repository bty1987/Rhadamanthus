package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.po.McolorPO;
import com.fanglin.store.po.MformatPO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.service.MpriceService;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.utils.BeanUtil;




@Service("mpriceService")
@Transactional(readOnly=true)
public class MpriceServiceImpl implements MpriceService{

	@Autowired
	private MpriceDao mpriceDao;

	@Override
	public List<MpriceVO> queryMprice(MpriceVO mpriceVO) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMprice(mpriceVO.getMgoods().getGid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) { 
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
			
		}
		
		return mpriceVOs;
	}
	
	@Override
	public List<MpriceVO> queryMpriceByGid(MpriceVO mpriceVO) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByGid(mpriceVO.getMgoods().getGid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) {
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
			
		}
		
		return mpriceVOs;
	}
	
	@Override
	public List<MpriceVO> queryMpriceByBid(MpriceVO mpriceVO) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByBid(mpriceVO.getMgoods().getMbrand().getBid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) {
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
			
		}
		
		return mpriceVOs;
	}
	
	@Override
	public List<MpriceVO> queryMpriceByPinyinName(String pinyinName) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByPinyinName(pinyinName);
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) {
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
			
		}
		
		return mpriceVOs;
	}
	
	@Override
	public List<MpriceVO> queryMpriceByStatus(MpriceVO mpriceVO) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByStatus(mpriceVO.getStatus());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) {
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
		}
		
		return mpriceVOs;
	}	

	@Override
	public List<MpriceVO> queryMpriceByGidAndCid(MpriceVO mpriceVO) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByGidAndCid(mpriceVO.getMgoods().getGid(), mpriceVO.getMcolor().getCid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) {
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
			
		}
		
		return mpriceVOs;
	}
	
	@Override
	public List<MpriceVO> queryMpriceByGidAndFid(MpriceVO mpriceVO) {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByGidAndFid(mpriceVO.getMgoods().getGid(), mpriceVO.getMformat().getFid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();
		
		MpriceVO mprice;
		
		for (MpricePO mpricePO : mpricePOs) {
			mprice = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());
			
			BeanUtil.copyProperties(mpricePO, mprice, Arrays.asList("mgoods", "mcolor","mformat"));
			BeanUtil.copyProperties(mpricePO.getMgoods(), mprice.getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(mpricePO.getMcolor(), mprice.getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(mpricePO.getMformat(), mprice.getMformat(), Arrays.asList("mgoods"));
			
			mpriceVOs.add(mprice);
			
		}
		
		return mpriceVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMprice(MpriceVO mpriceVO) throws FLException {
		
		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByGid(mpriceVO.getMgoods().getGid());
		
		if(mpricePOs != null && mpricePOs.size() != 0){
			for (MpricePO mprice : mpricePOs) {
				
				if(mprice.getMcolor().getCid() == mpriceVO.getMcolor().getCid() && mprice.getMformat().getFid() == mpriceVO.getMformat().getFid()){
					throw new FLException(111111, "价格已存在");
				}
				
			}
		}
		
		MpricePO mpricePO = new MpricePO(new MgoodsPO(), new McolorPO(), new MformatPO());
		
		BeanUtil.copyProperties(mpriceVO, mpricePO, Arrays.asList("mgoods","mcolor","mformat"));
		BeanUtil.copyProperties(mpriceVO.getMgoods(), mpricePO.getMgoods(), Arrays.asList("mbrand"));
		BeanUtil.copyProperties(mpriceVO.getMcolor(), mpricePO.getMcolor(), Arrays.asList("mgoods"));
		BeanUtil.copyProperties(mpriceVO.getMformat(), mpricePO.getMformat(), Arrays.asList("mgoods"));
		
		mpricePO.setStatus(MpricePO.STATUS_ENABLE_INT);
		
		mpriceDao.save(mpricePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMpriceForStatus(MpriceVO mpriceVO) throws FLException {
		
		MpricePO mpricePO = mpriceDao.get(mpriceVO.getPid());
		
		if(mpricePO == null){
			throw new FLException(260016, "价格不存在");
		}
		
		mpricePO.setStatus(mpriceVO.getStatus());
		
		mpriceDao.update(mpricePO);
		
		return 0;
	}

	

}
