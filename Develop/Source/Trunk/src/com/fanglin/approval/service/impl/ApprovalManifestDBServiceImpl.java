package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalManifestDBDao;
import com.fanglin.approval.dao.ApprovalManifestDBItemDao;
import com.fanglin.approval.po.ApprovalManifestDBItemPO;
import com.fanglin.approval.po.ApprovalManifestDBPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalManifestDBService;
import com.fanglin.approval.vo.ApprovalManifestDBItemVO;
import com.fanglin.approval.vo.ApprovalManifestDBVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.ManifestDao;
import com.fanglin.inventory.dao.ManifestItemDao;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.ManifestItemPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.service.GoodsStorehouseStockService;
import com.fanglin.inventory.service.PurchaseAmountService;
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

@Service("approvalManifestDBService")
@Transactional(readOnly = true)
public class ApprovalManifestDBServiceImpl implements ApprovalManifestDBService {

	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalManifestDBDao approvalManifestDBDao;
	
	@Autowired
	private ApprovalManifestDBItemDao approvalManifestDBItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ManifestItemDao manifestItemDao;
	
	@Autowired
	private ManifestDao manifestDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private PurchaseAmountService purchaseAmountService;
	
	@Autowired
	private GoodsStorehouseStockService goodsStorehouseStockService;
	
	@Autowired
	private StorehouseStockService storehouseStockService;
	
//	获取商品库存调拨
	@Override
	public List<ApprovalManifestDBItemVO> queryApprovalManifestDBItem (ApprovalVO approvalVO) throws FLException {
		
		 ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		    
		    if (approvalPO == null) {
				throw new FLException(240009 , "审批信息不存在");
			}
		    
		    ApprovalManifestDBPO approvalManifestDBPO = approvalManifestDBDao.queryApprovalManifestDBByAId(approvalPO.getAid());
		    
		    if (approvalManifestDBPO == null) {
				throw new FLException(240003, "审批信息不完整");
			}
		  
		    List<ApprovalManifestDBItemPO> approvalManifestDBItemPOs = approvalManifestDBItemDao.queryApprovalManifestDBItemByAmdbid(approvalManifestDBPO.getAmdbid());
		    List<ApprovalManifestDBItemVO> approvalManifestDBItemVOs = new ArrayList<ApprovalManifestDBItemVO>();
		    ApprovalManifestDBItemVO approvalManifestDBItemVO;
		    
		    for (ApprovalManifestDBItemPO approvalManifestDBItemPO : approvalManifestDBItemPOs) {
				
		    	approvalManifestDBItemVO = new ApprovalManifestDBItemVO(new GoodsVO(), new ColorVO(), new FormatVO(), new StorehouseVO(), new StorehouseVO());

		    	BeanUtil.copyProperties(approvalManifestDBItemPO, approvalManifestDBItemVO,"goods","color","format","instorehouse","outstorehouse");
		    	BeanUtil.copyProperties(approvalManifestDBItemPO.getGoods(), approvalManifestDBItemVO.getGoods(), Arrays.asList("assisType"));
		    	BeanUtil.copyProperties(approvalManifestDBItemPO.getColor(), approvalManifestDBItemVO.getColor());
		    	BeanUtil.copyProperties(approvalManifestDBItemPO.getFormat(), approvalManifestDBItemVO.getFormat());
				BeanUtil.copyProperties(approvalManifestDBItemPO.getInstorehouse(), approvalManifestDBItemVO.getInstorehouse());
				BeanUtil.copyProperties(approvalManifestDBItemPO.getOutstorehouse(), approvalManifestDBItemVO.getOutstorehouse());
				approvalManifestDBItemVOs.add(approvalManifestDBItemVO);
			}
		    
			return approvalManifestDBItemVOs;
		
	}
//	提交商品库存调拨审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForManifestDB(ApprovalVO approvalVO,ApprovalManifestDBVO approvalManifestDBVO ,List<ApprovalManifestDBItemVO> approvalManifestDBItemVOs,String userId) throws FLException {
	

        ApprovalPO approvalPO = new ApprovalPO();
		
		BeanUtil.copyProperties(approvalVO, approvalPO);
	
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MANIFESTDB_INT);//调拨
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);  
		approvalPO.setIdent("");
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setComment(approvalManifestDBVO.getComment());

		approvalPO.setContents(approvalManifestDBVO.getComment());
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		
		approvalPO.setSender(userDao.get(userId));
		
		approvalDao.save(approvalPO);
		
		ApprovalManifestDBPO approvalManifestDBPO = new ApprovalManifestDBPO();
		
		BeanUtil.copyProperties(approvalManifestDBVO, approvalManifestDBPO);
		approvalManifestDBPO.setAid(approvalPO.getAid());
		
		approvalManifestDBDao.save(approvalManifestDBPO);
		
		for (ApprovalManifestDBItemVO approvalManifestDBItemVO : approvalManifestDBItemVOs){
						
			ApprovalManifestDBItemPO approvalManifestDBItemPO = new ApprovalManifestDBItemPO(new GoodsPO(),new ColorPO(),new FormatPO(),new StorehousePO(),new StorehousePO());

			BeanUtil.copyProperties(approvalManifestDBItemVO, approvalManifestDBItemPO,Arrays.asList("goods","color","format","instorehouse","outstorehouse"));
			BeanUtil.copyProperties(approvalManifestDBItemVO.getGoods(), approvalManifestDBItemPO.getGoods(), Arrays.asList("assisType"));
			BeanUtil.copyProperties(approvalManifestDBItemVO.getColor(), approvalManifestDBItemPO.getColor());
			BeanUtil.copyProperties(approvalManifestDBItemVO.getFormat(), approvalManifestDBItemPO.getFormat());
			BeanUtil.copyProperties(approvalManifestDBItemVO.getInstorehouse(), approvalManifestDBItemPO.getInstorehouse());
			BeanUtil.copyProperties(approvalManifestDBItemVO.getOutstorehouse(), approvalManifestDBItemPO.getOutstorehouse());
			approvalManifestDBItemPO.setAmdbid(approvalManifestDBPO.getAmdbid());
			approvalManifestDBItemDao.save(approvalManifestDBItemPO);
			
		}
		List<ApprovalManifestDBItemPO> approvalManifestDBItemPOs = approvalManifestDBItemDao.queryApprovalManifestDBItemByAmdbid(approvalManifestDBPO.getAmdbid());
		if(approvalManifestDBItemPOs == null || approvalManifestDBItemPOs.size() <= 0){
			throw new FLException(260007, "货单无商品信息");
		}
		for(ApprovalManifestDBItemPO approvalManifestDBItemPO: approvalManifestDBItemPOs){
			long gid = approvalManifestDBItemPO.getGoods().getGid();
			long cid = approvalManifestDBItemPO.getColor().getCid();
			long fid = approvalManifestDBItemPO.getFormat().getFid();
		    float num = approvalManifestDBItemPO.getNum();
		    
		    if(approvalManifestDBItemPO.getOutstorehouse() != null){
		    	long oshId = approvalManifestDBItemPO.getOutstorehouse().getShId();
			    goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId,num);	
		    }
		}
		return 0;
	}

//	通过调拨审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalManifestDB(ApprovalVO approvalVO)throws FLException {
		
        ApprovalManifestDBPO approvalManifestDBPO = approvalManifestDBDao.queryApprovalManifestDBByAId(approvalVO.getAid());
		
		if (approvalManifestDBPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
        ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
		
		if (approvalPO == null) {
			throw new FLException(240009 , "审批信息不存在");
		}
		
        approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_APPROVAL_INT);
		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalDao.update(approvalPO);
		
		List<ApprovalManifestDBItemPO> approvalManifestDBItemPOs = approvalManifestDBItemDao.queryApprovalManifestDBItemByAmdbid(approvalManifestDBPO.getAmdbid());

		if(approvalManifestDBItemPOs == null || approvalManifestDBItemPOs.size() <= 0){
			throw new FLException(260007, "货单无商品信息");
		}
	
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "DB";
		
		UserPO userPO = userDao.get(approvalPO.getSender().getUserId());
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_DB_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		String manifestId = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		manifestPO.setManifestTime(approvalManifestDBPO.getManifestTime());
		manifestPO.setComment(approvalManifestDBPO.getComment());
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setType((short)5);
		manifestPO.setCreateUser(userPO);
		
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setAttachment(approvalManifestDBPO.getAttachment());
		
		manifestDao.save(manifestPO);
		
		ManifestItemPO manifestItemPO;
		
		for(ApprovalManifestDBItemPO approvalManifestDBItemPO: approvalManifestDBItemPOs){
			
			manifestItemPO = new ManifestItemPO(new GoodsPO(),new ColorPO(),new FormatPO());
			
			long gid = approvalManifestDBItemPO.getGoods().getGid();
			long cid = approvalManifestDBItemPO.getColor().getCid();
			long fid = approvalManifestDBItemPO.getFormat().getFid();
			float num = approvalManifestDBItemPO.getNum();
			
			manifestItemPO.setGoods(approvalManifestDBItemPO.getGoods());
			manifestItemPO.setColor(approvalManifestDBItemPO.getColor());
			manifestItemPO.setFormat(approvalManifestDBItemPO.getFormat());
			manifestItemPO.setNum(num);
			manifestItemPO.setComment(approvalManifestDBItemPO.getComment());
			manifestItemPO.setUnitPrice((float)0);
		
			if(approvalManifestDBItemPO.getInstorehouse() != null){
				
				long ishId = approvalManifestDBItemPO.getInstorehouse().getShId();
				
				manifestItemPO.setInstorehouse(goodsStorehouseStockService.instorehouse(gid,cid, fid,ishId, num));
				storehouseStockService.updateStorehouseStock(ishId, month, num);
				
				total = Arith.add(total, manifestItemPO.getUnitPrice());
			}
			
			if(approvalManifestDBItemPO.getOutstorehouse() != null){
				
				long oshId = approvalManifestDBItemPO.getOutstorehouse().getShId();
				
				manifestItemPO.setOutstorehouse(approvalManifestDBItemPO.getOutstorehouse());
				storehouseStockService.updateStorehouseStock(oshId, month, -num);
				
				total = Arith.sub(total, manifestItemPO.getUnitPrice());
			}
			
			manifestItemPO.setMid(manifestPO.getMid());
			
			manifestItemDao.save(manifestItemPO);
		}
		
		manifestPO.setTotal(total);
		manifestPO.setComment(approvalManifestDBPO.getComment());
		purchaseAmountService.updatePurchaseAmount(month, total);

		return 0;
	}

//	拒绝调拨审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseManifestDB(ApprovalVO approvalVO) throws FLException {
		  ApprovalManifestDBPO approvalManifestDBPO = approvalManifestDBDao.queryApprovalManifestDBByAId(approvalVO.getAid());
			
			if (approvalManifestDBPO == null) {
				throw new FLException(240003, "审批信息不完整");
			}
	        ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());
			
			if (approvalPO == null) {
				throw new FLException(240009 , "审批信息不存在");
			}
			
	        approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_REFUSE_INT);
	        approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
	
			approvalDao.update(approvalPO);
			List<ApprovalManifestDBItemPO> approvalManifestDBItemPOs = approvalManifestDBItemDao.queryApprovalManifestDBItemByAmdbid(approvalManifestDBPO.getAmdbid());
			if(approvalManifestDBItemPOs == null || approvalManifestDBItemPOs.size() <= 0){
				throw new FLException(260007, "货单无商品信息");
			}
			for(ApprovalManifestDBItemPO approvalManifestDBItemPO: approvalManifestDBItemPOs){
				long gid = approvalManifestDBItemPO.getGoods().getGid();
				long cid = approvalManifestDBItemPO.getColor().getCid();
				long fid = approvalManifestDBItemPO.getFormat().getFid();
			    float num = approvalManifestDBItemPO.getNum();
			    
			    if(approvalManifestDBItemPO.getOutstorehouse() != null){
			    	long oshId = approvalManifestDBItemPO.getOutstorehouse().getShId();
				    goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, -num);	
			    }
			}
	
		return 0;
	}

}
