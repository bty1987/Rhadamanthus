package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.dao.PurchaseItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.PurchaseItemPO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.service.PurchaseService;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import java.sql.Timestamp;

@Service("purchaseService")
@Transactional(readOnly=true)
public class PurchaseServiceImpl  implements PurchaseService{

	@Autowired
	private PurchaseDao purchaseDao;
	
	@Autowired
	private PurchaseItemDao purchaseItemDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pagePurchase(Paging paging, List<Filter> filters) {
		
		List<PurchasePO> purchasePOs = purchaseDao.pagePurchase(paging, filters);
		List<PurchaseVO> purchaseVOs = new ArrayList<PurchaseVO>();
		
		PurchaseVO purchaseVO;
		
		for(PurchasePO purchasePO: purchasePOs){
			purchaseVO = new PurchaseVO(new UserVO());
			
			BeanUtil.copyProperties(purchasePO, purchaseVO, Arrays.asList("user"));
			purchaseVO.getUser().setBaseInfo(purchasePO.getUser());
			purchaseVOs.add(purchaseVO);
		}

		paging.setData(purchaseVOs);
		
	}
	
	@Override
	public PurchaseVO queryPurchaseByPid(PurchaseVO purchaseVO){
		
		PurchasePO purchasePO = purchaseDao.queryPurchaseByPid(purchaseVO.getPid());
		
		purchaseVO = new PurchaseVO();
		
		BeanUtil.copyProperties(purchasePO, purchaseVO, Arrays.asList("user"));
		
		return purchaseVO;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addPurchase(PurchaseVO purchaseVO,List<PurchaseItemVO> purchaseItemVOs,String userId) throws FLException{
		//PO作为编号前缀 , 之后由8位数字组成
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_PO_INT,"yyyyMMdd");
		String manifestId = String.valueOf("PO") + FormatUtil.fillZero(count, "00000000");
		
		PurchasePO purchasePO = new PurchasePO(manifestId);
		
		BeanUtil.copyProperties(purchaseVO, purchasePO, Arrays.asList("user"));
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		purchasePO.setUser(userPO);
		purchasePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		purchasePO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
		purchasePO.setStatus(PurchasePO.COLUMN_STATUS_STR);
		purchasePO.setBalanceStatus(PurchasePO.COLUMN_BALANCESTATUS_STR);
		//插入采购单信息
		purchaseDao.save(purchasePO);
		
		PurchaseItemPO purchaseItemPO;
		
		for(PurchaseItemVO purchaseItemVO:purchaseItemVOs){
			
			purchaseItemPO = new PurchaseItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			purchaseItemPO.setPid(purchasePO.getPid());
			
			BeanUtil.copyProperties(purchaseItemVO, purchaseItemPO, Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(purchaseItemVO.getGoods(), purchaseItemPO.getGoods());
			BeanUtil.copyProperties(purchaseItemVO.getColor(), purchaseItemPO.getColor());
			BeanUtil.copyProperties(purchaseItemVO.getFormat(), purchaseItemPO.getFormat());
			
			purchaseItemPO.setSurplus(purchaseItemVO.getNum());
			//插入采购单下的采购项信息
			purchaseItemDao.save(purchaseItemPO);			
		}
		
		return 0;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePurchase(PurchaseVO purchaseVO) throws FLException{
		
		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());
		
		if(purchasePO == null){
			throw new FLException(260017, "采购单不存在");
		}
		
		if(purchasePO.getStatus()==2){
			throw new FLException(260018, "采购单状态不可操作");
		}
		
		purchasePO.setPid(purchaseVO.getPid());
		purchasePO.setComment(purchaseVO.getComment());
		
		purchaseDao.update(purchasePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updatePurchaseStatus(PurchaseVO purchaseVO) throws FLException{
		
		PurchasePO purchasePO = purchaseDao.get(purchaseVO.getPid());
		
		if(purchasePO == null){
			throw new FLException(260017, "采购单不存在");
		}
		
		if(purchasePO.getStatus()==2){
			throw new FLException(260018, "采购单状态不可操作");
		}
		
		purchasePO.setPid(purchaseVO.getPid());
		purchasePO.setStatus(PurchasePO.COLUMN_SECTIONSTATUS_STR);
		
		purchaseDao.update(purchasePO);
		
		return 0;
	}
}
