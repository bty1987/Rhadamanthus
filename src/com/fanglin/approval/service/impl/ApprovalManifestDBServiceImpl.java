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
import com.fanglin.inventory.service.StorehouseStockService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

@Service("approvalManifestDBService")
@Transactional(readOnly = true)
public class ApprovalManifestDBServiceImpl implements ApprovalManifestDBService {
	
	@Autowired
	private CompanyDao companyDao;

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
	private GoodsStorehouseStockService goodsStorehouseStockService;
	
	@Autowired
	private StorehouseStockService storehouseStockService;
	

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

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForManifestDB(ApprovalVO approvalVO,ApprovalManifestDBVO approvalManifestDBVO ,List<ApprovalManifestDBItemVO> approvalManifestDBItemVOs,String userId, int company) throws FLException {
	

        ApprovalPO approvalPO = new ApprovalPO();
		
        BeanUtil.copyProperties(approvalVO, approvalPO,Arrays.asList("receiver","sender"));
	
        UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MANIFESTDB_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);  
		approvalPO.setIdent("");
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setComment(approvalManifestDBVO.getComment());
		approvalPO.setContents(approvalManifestDBVO.getComment());
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
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
	public int approvalManifestDB(ApprovalPO approvalPO)throws FLException {
		
		CompanyPO companyPO = companyDao.get(approvalPO.getCompany());
		
		if(companyPO == null){
			throw new FLException(230015, "公司不存在");
		}
		
        ApprovalManifestDBPO approvalManifestDBPO = approvalManifestDBDao.queryApprovalManifestDBByAId(approvalPO.getAid());
		
		if (approvalManifestDBPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}
       
		List<ApprovalManifestDBItemPO> approvalManifestDBItemPOs = approvalManifestDBItemDao.queryApprovalManifestDBItemByAmdbid(approvalManifestDBPO.getAmdbid());

		if(approvalManifestDBItemPOs == null || approvalManifestDBItemPOs.size() <= 0){
			throw new FLException(260007, "货单无商品信息");
		}
		
		int company = approvalPO.getCompany();
	
		float total = 0f;
		String month = DateUtil.getDateToDateString(new Date(), "yyyyMM");
		
		String word = "DB";
		
		UserPO userPO = userDao.queryUserByUserId(approvalPO.getSender().getUserId());
		
		String currentDate = DateUtil.current("yyMMdd").toString();
	    int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_DB_INT, currentDate, company);
	    String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
	    String manifestId = companyPO.getShortname() + String.valueOf(word) + currentDate + endNo;
		
		ManifestPO manifestPO = new ManifestPO(manifestId);
		
		manifestPO.setManifestTime(approvalManifestDBPO.getManifestTime());
		manifestPO.setComment(approvalManifestDBPO.getComment());
		manifestPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		manifestPO.setType((short)5);
		manifestPO.setCreateUser(userPO);
		manifestPO.setStatus(ManifestPO.STATUS_DISABLE_INT);
		manifestPO.setAttachment(approvalManifestDBPO.getAttachment());
		manifestPO.setCompany(company);
		
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
		manifestDao.update(manifestPO);

		return 0;
	}

//	拒绝调拨审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseManifestDB(ApprovalPO approvalPO) throws FLException {
		  ApprovalManifestDBPO approvalManifestDBPO = approvalManifestDBDao.queryApprovalManifestDBByAId(approvalPO.getAid());
			
			if (approvalManifestDBPO == null) {
				throw new FLException(240003, "审批信息不完整");
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
				    goodsStorehouseStockService.outstorehouse(gid,cid,fid, oshId, -num);	
			    }
			}
	
		return 0;
	}

}
