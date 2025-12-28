package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.dingding.service.DingTalkMessageService;
import com.fanglin.information.dao.AwardPurchaseDao;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardPurchasePO;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.information.service.AwardPurchaseService;
import com.fanglin.information.vo.AwardPurchaseVO;
import com.fanglin.information.vo.AwardStockVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("awardPurchaseService")
@Transactional(readOnly = true)
public class AwardPurchaseServiceImpl implements AwardPurchaseService {

	@Autowired
	private AwardPurchaseDao awardPurchaseDao;

	@Autowired
	private UserDao userdDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DingTalkMessageService messageDDService;

	@Override
	public void pageAwardPurchase(Paging paging, List<Filter> filters, AwardPurchaseVO awardPurchase, int company) {

		List<AwardPurchasePO> awardPurchasePOs = awardPurchaseDao.pageAwardPurchase(paging, filters, company);
		List<AwardPurchaseVO> awardPurchaseVOs = new ArrayList<AwardPurchaseVO>();

		for (AwardPurchasePO awardPurchasePO : awardPurchasePOs) {

			AwardPurchaseVO awardPurchaseVO = new AwardPurchaseVO(new AwardStockVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			awardPurchaseVOs.add(awardPurchasePO.ptv(awardPurchaseVO));
		}

		paging.setData(awardPurchaseVOs);
	}

	@Override
	public List<AwardPurchaseVO> queryAwardPurchaseByFapid(AwardPurchaseVO awardPurchaseVO) throws FLException {

		List<AwardPurchaseVO> awardPurchaseVOs = new ArrayList<AwardPurchaseVO>();

		AwardPurchasePO awardPurchasePP = awardPurchaseDao.get(awardPurchaseVO.getFapid());

		if (awardPurchasePP != null) {
			awardPurchaseVOs.add(awardPurchasePP.ptv(new AwardPurchaseVO(new AwardStockVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		List<AwardPurchasePO> awardPurchasePOs = awardPurchaseDao.queryAwardPurchaseByFapid(awardPurchaseVO.getFapid());

		for (AwardPurchasePO awardPurchasePO : awardPurchasePOs) {

			awardPurchaseVO = new AwardPurchaseVO(new AwardStockVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			awardPurchaseVOs.add(awardPurchasePO.ptv(awardPurchaseVO));
		}

		return awardPurchaseVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAwardPurchase(AwardPurchaseVO awardPurchaseVO, String userId, int company) throws FLException {

		UserPO creater = userdDao.queryUserByUserId(userId);

		AwardStockPO awardStock = awardStockDao.get(awardPurchaseVO.getAwardStock().getAsId());

		AwardPurchasePO awardPurchasePO = new AwardPurchasePO(awardStock, creater, null, null).init(awardStock, creater, null, null, AwardPurchasePO.STATUS_INIT_INT, company, awardPurchaseVO.getNum(), awardPurchaseVO.getActivity(), awardPurchaseVO.getDept(), awardPurchaseVO.getComment());

		awardPurchaseDao.save(awardPurchasePO);

		SystemConfigPO key = systemConfigDao.querySystemConfig("MESSAGE_DING_GROUP_AWARD_PURCHASE");

		CompanyPO companyPO = companyDao.get(company);

		if (key != null) {
			messageDDService.sendMessage(key.getValue(), String.format("公司名: %s, 礼品名称: %s, 收到一条采购申请, 请及时查收.", companyPO.getName(), awardPurchasePO.getAwardStock().getName()));
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void purchaseAwardPurchase(AwardPurchaseVO awardPurchaseVO, String userId) throws FLException {

		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchaseVO.getApid());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_INIT_INT) {
			throw new FLException(160058, "奖品采购不可操作");
		}

		UserPO purchaser = userdDao.queryUserByUserId(userId);

		awardPurchasePO.setPurchaser(purchaser);

		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_PROC_INT);
		awardPurchasePO.setPurchaseTime(DateUtil.getDateToTimestamp(new Date()));

		awardPurchaseDao.update(awardPurchasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void instoreAwardPurchase(AwardPurchaseVO awardPurchaseVO, String userId) throws FLException {

		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchaseVO.getApid());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_PROC_INT) {
			throw new FLException(160058, "奖品采购不可操作");
		}

		if (awardPurchasePO.getSurplus() < awardPurchaseVO.getNum()) {
			throw new FLException(160059, "奖品采购入库量大于剩余量");
		}

		AwardStockPO awardStockPO = awardStockDao.get(awardPurchasePO.getAwardStock().getAsId());

		UserPO instorer = userdDao.queryUserByUserId(userId);

		AwardPurchasePO purchasePO = new AwardPurchasePO(awardPurchasePO.getAwardStock(), awardPurchasePO.getCreater(), awardPurchasePO.getPurchaser(), instorer);

		BeanUtil.copyProperties(awardPurchasePO, purchasePO, Arrays.asList("awardStock", "creater", "purchaser", "instorer"));

		purchasePO.setFapid(awardPurchasePO.getApid());
		purchasePO.setNum(awardPurchaseVO.getNum());
		purchasePO.setSurplus(0);
		purchasePO.setInprice(awardPurchaseVO.getInprice());

		purchasePO.setInstoreTime(DateUtil.getDateToTimestamp(new Date()));
		purchasePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		purchasePO.setPurchaseTime(awardPurchasePO.getPurchaseTime());

		purchasePO.setStatus(AwardPurchasePO.STATUS_WARE_INT);

		awardPurchaseDao.save(purchasePO);

		if (awardPurchaseVO.getNum() == awardPurchasePO.getSurplus()) {

			awardPurchasePO.setInstorer(instorer);
			awardPurchasePO.setInstoreTime(DateUtil.getDateToTimestamp(new Date()));
			awardPurchasePO.setStatus(AwardPurchasePO.STATUS_FINISH_INT);
		}

		awardPurchasePO.setSurplus(Arith.sub(awardPurchasePO.getSurplus(), awardPurchaseVO.getNum()));

		if (awardStockPO.getIsStock() == AwardStockPO.ISSTOCK_CAL_INT) {

			awardStockPO.setNum(Arith.add(awardPurchasePO.getAwardStock().getNum(), awardPurchaseVO.getNum()));

			awardStockDao.update(awardStockPO);

			AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, instorer, null, AwardRecordPO.TYPE_CG_INT, AwardRecordPO.SUBTYPE_INWARE_INT, awardStockPO.getStoreroom(), AwardStockPO.ISSTOCK_CAL_INT, awardPurchaseVO.getInprice(), awardPurchaseVO.getNum(), null);

			awardRecordDao.save(awardRecordPO);
		}

		awardPurchaseDao.update(awardPurchasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void balanceAwardPurchase(AwardPurchaseVO awardPurchaseVO, String userId) throws FLException {

		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchaseVO.getApid());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_WARE_INT) {
			throw new FLException(160058, "奖品采购不可操作");
		}

		awardPurchasePO.setBaprice(awardPurchaseVO.getBaprice());
		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_CLOSE_INT);
		awardPurchasePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

		awardPurchaseDao.update(awardPurchasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelAwardPurchase(AwardPurchaseVO awardPurchase) throws FLException {

		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchase.getApid());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_INIT_INT) {
			throw new FLException(160058, "奖品采购不可操作");
		}

		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_DISABLE_INT);

		awardPurchaseDao.update(awardPurchasePO);
	}

}
