/**
 * @File Name		: ProtationServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignCostPO;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.data.po.PresignPricePO;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.PresignCostDao;
import com.fanglin.data.quotation.dao.PresignItemDao;
import com.fanglin.data.quotation.dao.PresignPriceDao;
import com.fanglin.data.quotation.dao.PresignProduceDao;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.ProtationCostDao;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.dao.ProtationItemDao;
import com.fanglin.quotation.po.ProtationCostPO;
import com.fanglin.quotation.po.ProtationDO;
import com.fanglin.quotation.po.ProtationItemPO;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.service.ProtationService;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("protationService")
@Transactional(readOnly = true)
public class ProtationServiceImpl implements ProtationService {

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private ProtationItemDao protationItemDao;

	@Autowired
	private ProtationCostDao protationCostDao;

	@Autowired
	private PresignProduceDao presignProduceDao;

	@Autowired
	private PresignPriceDao presignPriceDao;

	@Autowired
	private PresignCostDao presignCostDao;

	@Autowired
	private PresignItemDao presignItemDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageProtation(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<ProtationDO> protationDOs = protationDao.pageProtation(paging, filters, company);

		List<ProtationVO> protationVOs = new ArrayList<ProtationVO>();

		for (ProtationDO protationDO : protationDOs) {
			protationVOs.add(protationDO.ptv(new ProtationVO(new DecorationVO(), new UserBaseVO(), new QuotationVersionVO())));
		}
		paging.setData(protationVOs);

	}

	@Override
	public List<ProtationVO> queryProtationByOrderId(ProtationVO protationVO) {

		List<ProtationPO> protationPOs = protationDao.queryProtationByOrderId(protationVO.getOrderId());
		List<ProtationVO> protationVOs = new ArrayList<ProtationVO>();

		for (ProtationPO protationPO : protationPOs) {
			protationVOs.add(protationPO.ptv(new ProtationVO(null, new UserBaseVO(), new QuotationVersionVO())));
		}

		return protationVOs;
	}

	@Override
	public ProtationVO queryProtationForDefaultByOrderId(ProtationVO protationVO) {

		ProtationPO protationPO = protationDao.queryProtationForDefaultByOrderId(protationVO.getOrderId());

		if (protationPO == null) return protationVO;

		protationVO.setCreater(new UserBaseVO());

		protationVO.setVersion(new QuotationVersionVO());

		protationPO.ptv(protationVO);

		return protationVO;
	}

	@Override
	public ProtationVO queryProtationByPid(ProtationVO protationVO) {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) return protationVO;

		protationVO.setCreater(new UserBaseVO());

		protationVO.setVersion(new QuotationVersionVO());

		protationPO.ptv(protationVO);

		return protationVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addProtation(ProtationVO protationVO, String userId, int company) throws FLException {

		String orderId = protationVO.getOrderId();
		Long ppid = protationVO.getPpid();

		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("protationlimit", company);

		if (protationDao.countProtationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))) {
			throw new FLException(200001, "报价已经达到数量上限");
		}

		DecorationPO decorationPO = checkDecoration(orderId);

		ProtationPO protationPO = new ProtationPO();

		BeanUtil.copyProperties(protationVO, protationPO, Arrays.asList("creater", "version"));

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		PresignProducePO presignProducePO = presignProduceDao.get(ppid);

		if (presignProducePO == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		protationPO.setOrderId(orderId);
		protationPO.setPpid(ppid);

		protationPO.setCreater(userDao.queryUserByUserId(userId));
		protationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		protationPO.setProduct(presignProducePO.getName());
		protationPO.setUnitPrice(presignProducePO.getUnitPrice());
		protationPO.setDiscount(presignProducePO.getDiscount());
		protationPO.setManageFormula(presignProducePO.getManageFormula());
		protationPO.setManageDiscount(presignProducePO.getManageDiscount());
		protationPO.setCostPrice(presignProducePO.getCostPrice());
		protationPO.setTaxFormula(presignProducePO.getTaxFormula());

		protationPO.setProfitRate(presignProducePO.getProfitRate());
		protationPO.setCostRate(presignProducePO.getCostRate());
		protationPO.setMostRate(presignProducePO.getMostRate());
		protationPO.setManageRate(presignProducePO.getManageRate());
		protationPO.setTaxRate(presignProducePO.getTaxRate());

		if (presignProducePO.getVersion() != null) {
			protationPO.setVersion(presignProducePO.getVersion());
		}

		PresignPricePO presignPricePO = presignPriceDao.queryPresignPrice(ppid, protationVO.getQuoteArea());

		if (presignPricePO != null) {
			protationPO.setQuotePrice(presignPricePO.getPrice());
			protationPO.setCostPrice(presignPricePO.getCostPrice());
			protationPO.setMostPrice(presignPricePO.getMostPrice());
			protationPO.setActivityPrice(presignPricePO.getActivityPrice());
		} else {
			protationPO.setQuotePrice(presignProducePO.getQuotePrice());
			protationPO.setCostPrice(presignProducePO.getCostPrice());
			protationPO.setMostPrice(presignProducePO.getMostPrice());
			protationPO.setActivityPrice(presignProducePO.getActivityPrice());
		}

		ProtationPO defaultProtationPO = protationDao.queryProtationForDefaultByOrderId(orderId);

		if (defaultProtationPO == null) {
			protationPO.setDefaults(ProtationPO.DEFAULT_DEFAULT_INT);

			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());

			decorationDao.update(decorationPO);
		} else {
			protationPO.setDefaults(ProtationPO.DEFAULT_COMMON_INT);
		}

		protationDao.save(protationPO);

		long pid = protationPO.getPid();

		List<PresignItemPO> presignItemPOs = presignItemDao.queryPresignItem(ppid);

		for (PresignItemPO presignItemPO : presignItemPOs) {

			ProtationItemPO protationItemPO = new ProtationItemPO();

			if (presignItemPO.getType() == PresignItemPO.TYPE_BASICS_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_BASICS_INT);
			}// 功能区

			if (presignItemPO.getType() == PresignItemPO.TYPE_OPTIONAL_INT && presignItemPO.getAtttype() == PresignItemPO.ATTTYPE_CURRENT_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_PRCURRENT_INT);
			} else if (presignItemPO.getType() == PresignItemPO.TYPE_OPTIONAL_INT && presignItemPO.getAtttype() == PresignItemPO.ATTTYPE_ENGINEERING_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_PROJECT_INT);
			} else if (presignItemPO.getType() == PresignItemPO.TYPE_OPTIONAL_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_PRINCIPAL_INT);
			}// 可选配

			if (presignItemPO.getType() == PresignItemPO.TYPE_CUSTOM_INT && presignItemPO.getAtttype() == PresignItemPO.ATTTYPE_ENGINEERING_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_ADDWORK_INT);
			} else if (presignItemPO.getType() == PresignItemPO.TYPE_CUSTOM_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_ADDMAIN_INT);
			}// 增项

			if (presignItemPO.getType() == PresignItemPO.TYPE_ADDTION_INT && presignItemPO.getAtttype() == PresignItemPO.ATTTYPE_ENGINEERING_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_ACCWORK_INT);
			} else if (presignItemPO.getType() == PresignItemPO.TYPE_ADDTION_INT) {
				protationItemPO.setType(ProtationItemPO.TYPE_ACCMAIN_INT);
			}// 赋能

			protationItemPO.setPid(pid);
			protationItemPO.setBasicNum(presignItemPO.getBasicNum());
			protationItemPO.setName(presignItemPO.getName());
			protationItemPO.setCost(presignItemPO.getCost());
			protationItemPO.setPrice(presignItemPO.getPrice());
			protationItemPO.setAddPrice(presignItemPO.getAddPrice());
			protationItemPO.setSubPrice(presignItemPO.getSubPrice());
			protationItemPO.setAchePrice(presignItemPO.getAchePrice());
			protationItemPO.setNum(presignItemPO.getBasicNum());
			protationItemPO.setAreaCale(presignItemPO.getAreaCale());
			protationItemPO.setOnetype(presignItemPO.getOnetype());
			protationItemPO.setAtttype(presignItemPO.getAtttype());
			protationItemPO.setItem(presignItemPO);

			protationItemDao.save(protationItemPO);
		}

		List<PresignCostPO> presignCostPOs = presignCostDao.queryPresignCost(ppid);

		for (PresignCostPO presignCostPO : presignCostPOs) {

			ProtationCostPO protationCostPO = new ProtationCostPO();

			protationCostPO.setPid(pid);
			protationCostPO.setToplimit(presignCostPO.getToplimit());
			protationCostPO.setLowlimit(presignCostPO.getLowlimit());
			protationCostPO.setCostPrice(presignCostPO.getCostPrice());

			protationCostDao.save(protationCostPO);

		}

		BeanUtil.copyPropertie(protationPO, protationVO, Arrays.asList("creater", "version"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationVO.getName() != null) {
			protationPO.setName(protationVO.getName());
		}

		if (protationVO.getComment() != null) {
			protationPO.setComment(protationVO.getComment());
		}

		if (protationVO.getVersion() != null && protationVO.getVersion().getQvId() != null) {
			protationPO.setVersion(new QuotationVersionPO(protationVO.getVersion().getQvId()));
		}

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProtationForProfit(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		PresignProducePO presignProducePO = presignProduceDao.get(protationPO.getPpid());

		if (presignProducePO == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		if (protationVO.getDiscount() != null) {
			protationPO.setDiscount(presignProducePO.getDiscountt());
		}

		if (protationVO.getManageDiscount() != null) {
			protationPO.setManageDiscount(presignProducePO.getManageDiscountt());
		}

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProtationForAdvance(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		DecorationPO decorationPO = checkDecoration(protationPO.getOrderId());

		protationPO.setTotalCost(protationVO.getTotalCost());
		protationPO.setTotalProfit(protationVO.getTotalProfit());

		protationPO.convert(protationVO);

		if (protationPO.getDefaults() == ProtationPO.DEFAULT_DEFAULT_INT) {
			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());
			decorationDao.update(decorationPO);
		}

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProtationForStatus(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		checkDecoration(protationPO.getOrderId());

		protationPO.setStatus(protationVO.getStatus());

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeProtationForDefault(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		DecorationPO decorationPO = checkDecoration(protationVO.getOrderId());

		if (protationPO.getDefaults() == ProtationPO.DEFAULT_COMMON_INT) {

			protationPO.setDefaults(ProtationPO.DEFAULT_DEFAULT_INT);

			protationDao.clearProtationForDefaultByOrderId(protationPO.getOrderId());

			protationDao.update(protationPO);

			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());

			decorationDao.update(decorationPO);
		}

		BeanUtil.copyPropertie(protationPO, protationVO, Arrays.asList("creater", "version"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		checkDecoration(protationPO.getOrderId());

		protationDao.delete(protationPO);

		protationItemDao.deleteProtationItem(protationPO.getPid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtation(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		protationPO.setStatus(ProtationPO.STATUS_LOCK_INT);

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unlockProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_LOCK_INT) {
			throw new FLException(200047, "预签状态不可操作");
		}

		protationPO.setStatus(ProtationPO.STATUS_INIT_INT);

		protationDao.update(protationPO);

		return 0;
	}

	public DecorationPO checkDecoration(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(200047, "预签状态不可操作");
		}

		return decorationPO;
	}

	public ProtationPO checkProtation(long pid) throws FLException {

		ProtationPO protationPO = protationDao.get(pid);

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_INIT_INT) {
			throw new FLException(200047, "预签状态不可操作");
		}

		return protationPO;
	}

}
