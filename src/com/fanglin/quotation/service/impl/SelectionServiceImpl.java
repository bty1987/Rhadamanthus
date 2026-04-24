package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.SelectionDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SelectionDO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.quotation.service.SelectionService;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("selectionService")
@Transactional(readOnly = true)
public class SelectionServiceImpl implements SelectionService {

	private static final Logger log = LoggerFactory.getLogger(SelectionServiceImpl.class);

	@Autowired
	private SelectionDao selectionDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Override
	public void pageSelection(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<SelectionDO> selectionDOs = selectionDao.pageSelection(paging, filters, company);
		List<SelectionVO> selectionVOs = new ArrayList<SelectionVO>();

		for (SelectionDO selectionDO : selectionDOs) {

			SelectionVO selectionVO = new SelectionVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			selectionVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(selectionDO, selectionVO, Arrays.asList("decoration", "creater", "splitter", "traner"));

			BeanUtil.copyProperties(selectionDO.getCreater(), selectionVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			BeanUtil.copyProperties(selectionDO.getSplitter(), selectionVO.getSplitter(), Arrays.asList("duty", "dept", "role"));

			BeanUtil.copyProperties(selectionDO.getTraner(), selectionVO.getTraner(), Arrays.asList("duty", "dept", "role"));

			selectionDO.getDecoration().ptvcascade(selectionVO.getDecoration());

			selectionVOs.add(selectionVO);
		}

		paging.setData(selectionVOs);
	}

	@Override
	public SelectionVO querySelectionByQid(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.querySelectionByQid(selectionVO.getQid());

		if (selectionPO == null) return null;

		selectionVO = new SelectionVO();

		BeanUtil.copyProperties(selectionPO, selectionVO, Arrays.asList("creater", "splitter", "traner"));

		return selectionVO;
	}

	@Override
	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(selectionVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}

		SelectionPO selectionPO = selectionDao.querySelectionByQid(quotationPO.getQid());

		if (selectionPO == null) return null;

		selectionVO = new SelectionVO();

		BeanUtil.copyProperties(selectionPO, selectionVO, Arrays.asList("creater", "splitter", "traner"));

		return selectionVO;
	}

	@Override
	public int checkSelection(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(selectionPO.getQid());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {
			if (selectionItemDao.checkSelectionItem(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()) != 0) throw new FLException(200041, "存在未关联选材项");
		}

		if (selectionItemDao.checkSelectionItem(selectionPO.getOrderId()) != 0) throw new FLException(200041, "存在未关联选材项");

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public SelectionVO addSelection(SelectionVO selectionVO, String userId) throws FLException {

		SelectionPO selectionPO = saveSelection(selectionVO.getQid(), userId);

		BeanUtil.copyProperties(selectionPO, selectionVO, Arrays.asList("creater", "splitter", "traner"));

		selectionPO.setCreater(userDao.queryUserByUserId(userId));
		selectionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		return selectionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSelection(Long qid, String userId) throws FLException {

		saveSelection(qid, userId);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSelection(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		if (selectionVO.getSplitter() != null) {
			UserPO splitter = userDao.queryUserByUserId(selectionVO.getSplitter().getUserId());
			selectionPO.setSplitter(splitter);
		}

		if (selectionVO.getTraner() != null) {
			UserPO traner = userDao.queryUserByUserId(selectionVO.getTraner().getUserId());
			selectionPO.setTraner(traner);
		}

		selectionDao.update(selectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSelectionForAdvance(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		BeanUtil.copyProperties(selectionVO, selectionPO, Arrays.asList("creater", "splitter", "traner"));

		selectionDao.update(selectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmSelection(DecorationVO decorationVO, SelectionVO selectionVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			decorationVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (decorationVO.getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(SensitiveDataHelper.encrypt(decorationVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		selectionPO.setIsAffirm(selectionPO.ISAFFIRM_CONFIRMED_INT);
		selectionPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

		selectionDao.update(selectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockSelection(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		selectionPO.setStatus(SelectionPO.STATUS_LOCK_INT);

		selectionDao.update(selectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unlockSelection(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		selectionPO.setStatus(SelectionPO.STATUS_INIT_INT);

		selectionDao.update(selectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetSelection(SelectionVO selectionVO) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		selectionPO.setIsAffirm(SelectionPO.ISAFFIRM_UNCONFIRMED_INT);
		selectionPO.setAffirmTime(null);

		selectionDao.update(selectionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendSelection(SelectionVO selectionVO, String userId) throws FLException {

		SelectionPO selectionPO = selectionDao.get(selectionVO.getSid());

		if (selectionPO == null) {
			throw new FLException(200035, "选材单不存在");
		}

		checkSelection(selectionVO);

		String orderId = selectionPO.getOrderId();

		UserPO sender = userDao.queryUserByUserId(userId);

		log.info(String.format("pages/quotation/selection/selection?orderId=%s", orderId));

		decorationService.sendMessage(orderId, "装修单", "请您及时查收点确认选材信息。", String.format("pages/quotation/selection/selection?orderId=%s", orderId), sender);

		selectionPO.setSendTime(DateUtil.getDateToTimestamp(new Date()));

		selectionDao.update(selectionPO);

		return 0;
	}

	private SelectionPO saveSelection(Long qid, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		SelectionPO selectionPO = new SelectionPO();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());

		selectionPO.setCompany(decorationPO.getCompany());
		selectionPO.setOrderId(quotationPO.getOrderId());
		selectionPO.setQid(quotationPO.getQid());
		selectionPO.setStatus(SelectionPO.STATUS_INIT_INT);
		selectionPO.setTotal(0L);

		selectionPO.setCreater(userDao.queryUserByUserId(userId));
		selectionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		selectionDao.save(selectionPO);

		return selectionPO;
	}

}
