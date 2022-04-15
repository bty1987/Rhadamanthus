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
import com.fanglin.data.po.PresignCostPO;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.data.quotation.dao.PresignCostDao;
import com.fanglin.data.quotation.dao.PresignItemDao;
import com.fanglin.data.quotation.dao.PresignProduceDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.quotation.dao.ProtationCostDao;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.dao.ProtationItemDao;
import com.fanglin.quotation.po.ProtationCostPO;
import com.fanglin.quotation.po.ProtationItemPO;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.service.ProtationService;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

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
	public List<ProtationVO> queryProtationByOrderId(ProtationVO protationVO) {

		List<ProtationPO> protationPOs = protationDao.queryProtationByOrderId(protationVO.getOrderId());
		List<ProtationVO> protationVOs = new ArrayList<ProtationVO>();

		for (ProtationPO protationPO : protationPOs) {

			protationVO = new ProtationVO();

			BeanUtil.copyProperties(protationPO, protationVO, Arrays.asList("creater"));

			protationVOs.add(protationVO);
		}

		return protationVOs;
	}

	@Override
	public ProtationVO queryProtationForDefaultByOrderId(ProtationVO protationVO) {

		ProtationPO protationPO = protationDao.queryProtationForDefaultByOrderId(protationVO.getOrderId());

		BeanUtil.copyProperties(protationPO, protationVO, Arrays.asList("creater"));

		return protationVO;
	}

	@Override
	public ProtationVO queryProtationByPid(ProtationVO protationVO) {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		BeanUtil.copyProperties(protationPO, protationVO, Arrays.asList("creater"));

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

		DecorationPO decorationPO = checkProtationForDefaultByOrderId(orderId);

		ProtationPO protationPO = new ProtationPO();

		BeanUtil.copyProperties(protationVO, protationPO, Arrays.asList("creater"));

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

		protationPO.setQuotePrice(presignProducePO.getQuotePrice());
		protationPO.setQuoteArea(presignProducePO.getQuoteArea());
		protationPO.setCostPrice(presignProducePO.getCostPrice());
		protationPO.setProfitRate(presignProducePO.getProfitRate());
		protationPO.setPreferPrice(protationVO.getPreferPrice());
		protationPO.setUnitPrice(presignProducePO.getUnitPrice());
		protationPO.setMostPrice(presignProducePO.getMostPrice());
		protationPO.setCostRate(presignProducePO.getCostRate());
		protationPO.setMostRate(presignProducePO.getMostRate());

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

			protationItemPO.setPid(pid);
			protationItemPO.setBasicNum(presignItemPO.getBasicNum());
			protationItemPO.setName(presignItemPO.getName());
			protationItemPO.setCost(presignItemPO.getCost());
			protationItemPO.setPrice(presignItemPO.getPrice());
			protationItemPO.setType(presignItemPO.getType());
			protationItemPO.setNum(presignItemPO.getBasicNum());

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

		BeanUtil.copyPropertie(protationPO, protationVO, Arrays.asList("creater"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		checkProtationForDefaultByOrderId(protationPO.getOrderId());

		protationPO.setName(protationVO.getName());
		protationPO.setPreferPrice(protationVO.getPreferPrice());
		protationPO.setManagePrice(protationVO.getManagePrice());
		protationPO.setComment(protationVO.getComment());
		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProtationForAdvance(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		DecorationPO decorationPO = checkProtationForDefaultByOrderId(protationPO.getOrderId());

		protationPO.setTotalCost(protationVO.getTotalCost());
		protationPO.setTotalProfit(protationVO.getTotalProfit());

		convertProtationVOToPOForAdvance(protationVO, protationPO);

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

		checkProtationForDefaultByOrderId(protationPO.getOrderId());

		protationPO.setStatus(protationVO.getStatus());

		protationDao.update(protationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeProtationForDefault(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtationForStatusByEnabled(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		DecorationPO decorationPO = checkProtationForDefaultByOrderId(protationVO.getOrderId());

		if (protationPO.getDefaults() == ProtationPO.DEFAULT_COMMON_INT) {

			protationPO.setDefaults(ProtationPO.DEFAULT_DEFAULT_INT);

			protationDao.clearProtationForDefaultByOrderId(protationPO.getOrderId());

			protationDao.update(protationPO);

			decorationPO.setPrecontractPrice(protationPO.getTotalPrice());

			decorationDao.update(decorationPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = checkProtationForStatusByEnabled(protationVO.getPid());

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		checkProtationForDefaultByOrderId(protationPO.getOrderId());

		protationDao.delete(protationPO);

		protationItemDao.deleteProtationItem(protationPO.getPid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int lockProtation(ProtationVO protationVO) throws FLException {

		ProtationPO protationPO = protationDao.get(protationVO.getPid());

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

		protationPO.setStatus(ProtationPO.STATUS_UNLOCK_INT);

		protationDao.update(protationPO);

		return 0;
	}

	public static void convertProtationVOToPOForAdvance(ProtationVO protationVO, ProtationPO protationPO) {

		protationPO.setBasicPrice(protationVO.getBasicPrice());
		protationPO.setComdPrice(protationVO.getComdPrice());
		protationPO.setCommPrice(protationVO.getCommPrice());
		protationPO.setAdddPrice(protationVO.getAdddPrice());
		protationPO.setAddmPrice(protationVO.getAddmPrice());
		protationPO.setSubdPrice(protationVO.getSubdPrice());
		protationPO.setSubmPrice(protationVO.getSubmPrice());
		protationPO.setTotalPrice(protationVO.getTotalPrice());
		protationPO.setTotalCost(protationVO.getTotalCost());
	}

	public DecorationPO checkProtationForDefaultByOrderId(String orderId) throws FLException {

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

	public ProtationPO checkProtationForStatusByEnabled(long pid) throws FLException {

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
