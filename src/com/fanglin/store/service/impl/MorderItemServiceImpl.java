package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MorderItemDao;
import com.fanglin.store.po.MorderItemPO;
import com.fanglin.store.service.MorderItemService;
import com.fanglin.store.vo.AddressVO;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.BeanUtil;


@Service("morderItemService")
@Transactional(readOnly=true)
public class MorderItemServiceImpl implements MorderItemService{
	
	@Autowired
	private MorderItemDao morderItemDao;
	
	@Override
	public List<MorderItemVO> queryMorderItemByUidAndStatus(MorderItemVO morderItemVO) {
		
		List<MorderItemPO> morderItemPOs = morderItemDao.queryMorderItemByUidAndStatus(morderItemVO.getMorder().getMuser().getUid(), morderItemVO.getMorder().getStatus());
		List<MorderItemVO> morderItemVOs = new ArrayList<MorderItemVO>();
		
		for (MorderItemPO morderItemPO : morderItemPOs) {
			
			morderItemVO = new MorderItemVO(new MorderVO(new MuserVO(), new AddressVO()), new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
			
			BeanUtil.copyProperties(morderItemPO, morderItemVO, Arrays.asList("morder", "mprice"));
			BeanUtil.copyProperties(morderItemPO.getMorder(), morderItemVO.getMorder(), Arrays.asList("muser", "address"));
			BeanUtil.copyProperties(morderItemPO.getMorder().getMuser(), morderItemVO.getMorder().getMuser());
			BeanUtil.copyProperties(morderItemPO.getMorder().getAddress(), morderItemVO.getMorder().getAddress(), Arrays.asList("muser"));
			BeanUtil.copyProperties(morderItemPO.getMprice(), morderItemVO.getMprice(), Arrays.asList("mgoods", "mcolor", "mformat"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMgoods(), morderItemVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMcolor(), morderItemVO.getMprice().getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMformat(), morderItemVO.getMprice().getMformat(), Arrays.asList("mgoods"));
			
			morderItemVOs.add(morderItemVO);
		}
		
		return morderItemVOs;
	}
	
	@Override
	public List<MorderItemVO> queryMorderItemByOid(MorderItemVO orderItemVO) {
		
		List<MorderItemPO> morderItemPOs = morderItemDao.queryMorderItemByOid(orderItemVO.getMorder().getOid());
		List<MorderItemVO> morderItemVOs = new ArrayList<MorderItemVO>();
		
		for (MorderItemPO morderItemPO : morderItemPOs) {
			
			orderItemVO = new MorderItemVO(new MorderVO(), new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));
			
			BeanUtil.copyProperties(morderItemPO, orderItemVO, Arrays.asList("morder", "mprice"));
			BeanUtil.copyProperties(morderItemPO.getMorder(), orderItemVO.getMorder(), Arrays.asList("muser", "address"));
			BeanUtil.copyProperties(morderItemPO.getMprice(), orderItemVO.getMprice(), Arrays.asList("mgoods", "mcolor", "mformat"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMgoods(), orderItemVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMcolor(), orderItemVO.getMprice().getMcolor(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(morderItemPO.getMprice().getMformat(), orderItemVO.getMprice().getMformat(), Arrays.asList("mgoods"));
			
			morderItemVOs.add(orderItemVO);
		}
		
		return morderItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMorderItemForStatus(MorderItemVO orderItemVO) throws FLException {
		
		MorderItemPO morderItemPO = morderItemDao.get(orderItemVO.getOiid());
		
		if(morderItemPO == null){
			throw new FLException(111111, "订单项不存在");
		}
		
		morderItemPO.setStatus(orderItemVO.getStatus());
		
		morderItemDao.update(morderItemPO);
		
		return 0;
	}
	
}
