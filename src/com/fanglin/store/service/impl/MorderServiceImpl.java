package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.AddressDao;
import com.fanglin.store.dao.CartDao;
import com.fanglin.store.dao.MorderDao;
import com.fanglin.store.dao.MorderItemDao;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.AddressPO;
import com.fanglin.store.po.CartPO;
import com.fanglin.store.po.MorderItemPO;
import com.fanglin.store.po.MorderPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.MorderService;
import com.fanglin.store.vo.AddressVO;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("morderService")
@Transactional(readOnly=true)
public class MorderServiceImpl implements MorderService{

	@Autowired
	private MorderDao morderDao;
	
	@Autowired
	private MorderItemDao morderItemDao;
	
	@Autowired
	private MuserDao muserDao;
	
	@Autowired
	private AddressDao addressDao;
	
	@Autowired
	private MpriceDao mpriceDao;
	
	@Autowired
	private CartDao cartDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageMorder(Paging paging, List<Filter> filters) {
		
		if(filters.size() == 0) return;
		
		List<MorderPO> morderPOs = morderDao.pageMorder(paging, filters);
		List<MorderVO> morderVOs = new ArrayList<MorderVO>();
		
		MorderVO morderVO;
		
		for (MorderPO morderPO : morderPOs) {
			morderVO = new MorderVO(new MuserVO(), new AddressVO());
			
			BeanUtil.copyProperties(morderPO, morderVO, Arrays.asList("muser","address"));
			BeanUtil.copyProperties(morderPO.getMuser(), morderVO.getMuser());
			BeanUtil.copyProperties(morderPO.getAddress(), morderVO.getAddress(), Arrays.asList("muser"));
			
			morderVOs.add(morderVO);
		}
		
		paging.setData(morderVOs);
	}
	
	@Override
	public List<MorderVO> queryMorderByUid(MorderVO morderVO) {
		
		List<MorderPO> morderPOs = morderDao.queryMorderByUid(morderVO.getMuser().getUid());
		List<MorderVO> morderVOs = new ArrayList<MorderVO>();
		
		for (MorderPO morderPO : morderPOs) {
			morderVO = new MorderVO(new MuserVO(), new AddressVO());
			
			BeanUtil.copyProperties(morderPO, morderVO, Arrays.asList("muser","address"));
			BeanUtil.copyProperties(morderPO.getMuser(), morderVO.getMuser());
			BeanUtil.copyProperties(morderPO.getAddress(), morderVO.getAddress(), Arrays.asList("muser"));
			
			morderVOs.add(morderVO);
		}
		
		return morderVOs;
	}
	
	@Override
	public List<MorderVO> queryMorderByStatus(MorderVO morderVO) {
		
		List<MorderPO> morderPOs = morderDao.queryMorderByStatus(morderVO.getMuser().getUid(), morderVO.getStatus());
		List<MorderVO> morderVOs = new ArrayList<MorderVO>();
		
		for (MorderPO morderPO : morderPOs) {
			morderVO = new MorderVO(new MuserVO(), new AddressVO());
			
			BeanUtil.copyProperties(morderPO, morderVO, Arrays.asList("muser","address"));
			BeanUtil.copyProperties(morderPO.getMuser(), morderVO.getMuser());
			BeanUtil.copyProperties(morderPO.getAddress(), morderVO.getAddress(), Arrays.asList("muser"));
			
			morderVOs.add(morderVO);
		}
		
		return morderVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMorder(MorderVO morderVO, List<MorderItemVO> morderItemVOs, List<Long> cids) throws FLException{
		
		String word = "S";
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT,currentDate);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		String no = String.valueOf(word) + currentDate + endNo;
		
		MorderPO morderPO = new MorderPO(no);
		
		MuserPO muserPO = muserDao.queryMuserByUnion(morderVO.getMuser().getUnionVal());
		
		AddressPO addressPO = addressDao.get(morderVO.getAddress().getAid());
		
		BeanUtil.copyProperties(morderVO, morderPO, Arrays.asList("muser","address"));
		morderPO.setMuser(muserPO);
		morderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		morderPO.setAddress(addressPO);
		morderPO.setStatus(MorderPO.STATUS_INIT_STR);
		
		morderDao.save(morderPO);
		
		MorderItemPO morderItemPO; 
		
		if(morderItemVOs != null && morderItemVOs.size() != 0){
			
			for (MorderItemVO morderItemVO : morderItemVOs) {
				
				MpricePO mpricePO = mpriceDao.get(morderItemVO.getMprice().getPid());
				morderItemPO = new MorderItemPO(morderPO, mpricePO);
				
				BeanUtil.copyProperties(morderItemVO, morderItemPO, Arrays.asList("morder", "mprice"));
				
				morderItemDao.save(morderItemPO);
				
			}
			
		}
		
		if(cids != null && cids.size() != 0){
			for (Long cid : cids) {
				CartPO cartPO = cartDao.get(cid);
				
				cartDao.delete(cartPO);
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMorderForStatus(MorderVO morderVO) throws FLException {
		
		MorderPO morderPO = morderDao.get(morderVO.getOid());
		
		if(morderPO == null){
			throw new FLException(111111, "订单不存在");
		}
		
		morderPO.setStatus(morderVO.getStatus());
		
		morderDao.update(morderPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteMorder(MorderVO morderVO) throws FLException{
		
		MorderPO morderPO = morderDao.get(morderVO.getOid());
		
		if(morderPO == null){
			throw new FLException(111111, "订单不存在");
		}
		
		morderPO.setStatus(MorderPO.STATUS_DELETE_STR);
		
		morderDao.update(morderPO);
		
		List<MorderItemPO> morderItemPOs = morderItemDao.queryMorderItemByOid(morderVO.getOid());
		
		if(morderItemPOs != null && morderItemPOs.size() != 0){
			for (MorderItemPO morderItemPO : morderItemPOs) {
				morderItemPO.setStatus(MorderItemPO.STATUS_DELETE_STR);
				
				morderItemDao.update(morderItemPO);
			}
		}
		
		return 0;
	}


}
