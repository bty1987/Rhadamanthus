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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.po.ColorPO;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.service.ManifestService;
import com.fanglin.inventory.vo.ColorVO;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

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
	private ManifestService manifestService;

	@Override
	public List<ApprovalManifestDBItemVO> queryApprovalManifestDBItem(ApprovalVO approvalVO) throws FLException {

		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());

		if (approvalPO == null) {
			throw new FLException(240009, "审批信息不存在");
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

			BeanUtil.copyProperties(approvalManifestDBItemPO, approvalManifestDBItemVO, "goods", "color", "format", "instorehouse", "outstorehouse");
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
	@Transactional(rollbackFor = Exception.class)
	public int submitApprovalForManifestDB(ApprovalVO approvalVO, ApprovalManifestDBVO approvalManifestDBVO, List<ApprovalManifestDBItemVO> approvalManifestDBItemVOs, String userId, int company) throws FLException {

		ApprovalPO approvalPO = new ApprovalPO();

		BeanUtil.copyProperties(approvalVO, approvalPO, Arrays.asList("receiver", "sender"));

		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);

		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MANIFESTDB_INT);
		approvalPO.setIdent("");
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setApprovalTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setComment(approvalVO.getComment());
		approvalPO.setContents(approvalVO.getContents());
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);

		approvalDao.save(approvalPO);

		ApprovalManifestDBPO approvalManifestDBPO = new ApprovalManifestDBPO();

		BeanUtil.copyProperties(approvalManifestDBVO, approvalManifestDBPO);
		approvalManifestDBPO.setAid(approvalPO.getAid());

		approvalManifestDBDao.save(approvalManifestDBPO);

		for (ApprovalManifestDBItemVO approvalManifestDBItemVO : approvalManifestDBItemVOs) {

			ApprovalManifestDBItemPO approvalManifestDBItemPO = new ApprovalManifestDBItemPO(new GoodsPO(), new ColorPO(), new FormatPO(), new StorehousePO(), new StorehousePO());

			BeanUtil.copyProperties(approvalManifestDBItemVO, approvalManifestDBItemPO, Arrays.asList("goods", "color", "format", "instorehouse", "outstorehouse"));
			BeanUtil.copyProperties(approvalManifestDBItemVO.getGoods(), approvalManifestDBItemPO.getGoods(), Arrays.asList("assisType"));
			BeanUtil.copyProperties(approvalManifestDBItemVO.getColor(), approvalManifestDBItemPO.getColor());
			BeanUtil.copyProperties(approvalManifestDBItemVO.getFormat(), approvalManifestDBItemPO.getFormat());
			BeanUtil.copyProperties(approvalManifestDBItemVO.getInstorehouse(), approvalManifestDBItemPO.getInstorehouse());
			BeanUtil.copyProperties(approvalManifestDBItemVO.getOutstorehouse(), approvalManifestDBItemPO.getOutstorehouse());
			
			approvalManifestDBItemPO.setAmdbid(approvalManifestDBPO.getAmdbid());
			
			approvalManifestDBItemDao.save(approvalManifestDBItemPO);
		}
		
		return 0;
	}

	// 通过调拨审批
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int approvalManifestDB(ApprovalPO approvalPO) throws FLException {

		CompanyPO companyPO = companyDao.get(approvalPO.getCompany());

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		ApprovalManifestDBPO approvalManifestDBPO = approvalManifestDBDao.queryApprovalManifestDBByAId(approvalPO.getAid());

		if (approvalManifestDBPO == null) {
			throw new FLException(240003, "审批信息不完整");
		}

		List<ApprovalManifestDBItemPO> approvalManifestDBItemPOs = approvalManifestDBItemDao.queryApprovalManifestDBItemByAmdbid(approvalManifestDBPO.getAmdbid());

		if (approvalManifestDBItemPOs == null || approvalManifestDBItemPOs.size() <= 0) {
			throw new FLException(260007, "货单无商品信息");
		}
		
		List<ManifestItemVO> manifestItemVOs = new ArrayList<ManifestItemVO>();
		
		for(ApprovalManifestDBItemPO approvalManifestDBItemPO:approvalManifestDBItemPOs){
			manifestItemVOs.add(new ManifestItemVO().init(approvalManifestDBItemPO.getGoods().getGid(), approvalManifestDBItemPO.getColor().getCid(), approvalManifestDBItemPO.getFormat().getFid(), approvalManifestDBItemPO.getInstorehouse().getShid(), approvalManifestDBItemPO.getOutstorehouse().getShid(), 0, approvalManifestDBItemPO.getNum()));
		}

		manifestService.addManifestForDB(manifestItemVOs, approvalPO.getReceiver().getUserId(), companyPO.getCid());

		return 0;
	}

}
