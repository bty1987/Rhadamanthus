/**
 * @File Name		: QuotationServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("quotationService")
@Transactional(readOnly=true)
public class QuotationServiceImpl implements QuotationService {

	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;
	
	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Autowired
	private ExtensionItemDao extensionItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private QuotetionDao quotetionDao;
	
	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;
	
	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;
	
	@Autowired
	private QuotationItemDao quotationItemDao;
	
	@Override
	public QuotationVO queryQuotationByQid(long qId){
		QuotationPO quotationPO = quotationDao.get(qId);
		QuotationVO quotationVO = new QuotationVO();
		handleQuotation(quotationVO,quotationPO);
		return quotationVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO){
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(quotationVO.getOrderId());
		handleQuotation(quotationVO,quotationPO);
		return quotationVO;
	}
	
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO){
		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(quotationVO.getOrderId());
		handleListQuotation(quotationVOs,quotationPOs,quotationVO.getOrderId());
		return quotationVOs;
	}
	
	@Override
	public Map<String, List<String>> queryQuotationForConfig(int company) {
		
		Map<String, List<String>> config = new HashMap<String, List<String>>();
		
		config.put("manageRates", Arrays.asList(systemConfigDao.querySystemConfig("manageRate", company).getValue().split(",")));
		config.put("trafficRates", Arrays.asList(systemConfigDao.querySystemConfig("trafficRate", company).getValue().split(",")));
		
		return config;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotation(QuotationVO quotationVO, String userId, int company) throws FLException{
		
		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company);
		
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();
		
		if(quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);
		
		BeanUtil.copyProperties(quotationVO, quotationPO,Arrays.asList("creater"));
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		QuotationVersionPO quotationVersionPO = decorationPO.getVersion();
		
		if(quotationVersionPO == null){
			throw new FLException(200022, "报价版本不存在");
		}
		
 		quotationPO.setOrderId(orderId);
		quotationPO.setCreater(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationPO.setManageRate(quotationVersionPO.getManageRate());
		quotationPO.setTrafficRate(quotationVersionPO.getTrafficRate());
		quotationPO.setDiscount(10);
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		if(defaultQuotationPO == null){
			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
		}else{
			quotationPO.setDefaults(QuotationPO.DEFAULTS_NONDEFAULT_INT);
		}
		
		quotationDao.save(quotationPO);
		
		BeanUtil.copyProperties(quotationPO, quotationVO,Arrays.asList("creater"));
		
		QuotationFunctionAreaPO autogeneration = new QuotationFunctionAreaPO(quotationPO, "生成项目", 9999, QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT);
		
		quotationFunctionAreaDao.save(autogeneration);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		QuotationFunctionAreaItemPO trafficPrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), divisor);
		convertQuotationPOForAdvance(trafficPrice,"车运费", "", "其他", quotationVersionPO.getTrafficRate(),"0" ,0f, QuotationFunctionAreaItemPO.TYPE_QUOTATION_TRAFFIC_SHORT, quotationVersionPO.getTrafficDiscount(), autogeneration, "",QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);
		QuotationFunctionAreaItemPO managePrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), divisor);
		convertQuotationPOForAdvance(managePrice,"管理费", "", "其他", quotationVersionPO.getManageRate(),"0" ,0f,QuotationFunctionAreaItemPO.TYPE_QUOTATION_MANAGE_SHORT, quotationVersionPO.getManageDiscount(), autogeneration, "",QuotationFunctionAreaItemPO.SUBTYPE_QUOTATION_ENGINEERING_SHORT);
		quotationFunctionAreaItemDao.save(trafficPrice);
		quotationFunctionAreaItemDao.save(managePrice);
	
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotation(QuotationVO quotationVO) throws FLException{
		
		QuotationPO quotationPO  = checkQuotationForStatusByEnabled(quotationVO.getQid());

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());
		
		quotationPO.setDecorationStyle(quotationVO.getDecorationStyle());
		quotationPO.setQuotationName(quotationVO.getQuotationName());
		quotationPO.setContent(quotationVO.getContent());
		
		quotationDao.update(quotationPO);
		
		BeanUtil.copyProperties(quotationPO, quotationVO,Arrays.asList("creater"));
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeQuotationForDefault(QuotationVO quotationVO) throws FLException{
		
		QuotationPO quotationPO  = checkQuotationForStatusByEnabled(quotationVO.getQid());
		
		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(quotationPO.getOrderId());
		
		if(quotationPO.getDefaults() == QuotationPO.DEFAULTS_NONDEFAULT_INT){
			
			decorationPO.setQuotationPrice(quotationPO.getTotalPrice());
			decorationPO.setDiscount(quotationPO.getDiscount());
			
			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
			
			quotationDao.clearQuotationForDefaultByOrderId(quotationVO.getOrderId());
			
			quotationDao.update(quotationPO);
			decorationDao.update(decorationPO);
		}
		
		BeanUtil.copyProperties(quotationPO, quotationVO,Arrays.asList("creater"));
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationForAdvance(QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO  = checkQuotationForStatusByEnabled(quotationVO.getQid());

		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());
		
		convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		if(quotationPO.getDefaults() == QuotationPO.DEFAULTS_DEFAULT_INT){
			
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());
			
			decorationPO.setQuotationPrice(quotationPO.getTotalPrice());
			decorationPO.setDiscount(quotationPO.getDiscount());
			
			decorationDao.update(decorationPO);
		}
		
		quotationDao.update(quotationPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationForStatus(QuotationVO quotationVO, String userId)throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		quotationPO.setStatus(quotationVO.getStatus());
		
		quotationDao.update(quotationPO);
		
		ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
		serviceRecordPO.setType(ServiceRecordPO.TYPE_CHANGE_QUOTATION_INT);
		serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		serviceRecordPO.setOperateUserId(userId);
		serviceRecordPO.setInfo(String.format("装修单:%s,报价ID%d,更新状态", quotationPO.getOrderId(), quotationPO.getQid()));
		
		serviceRecordDao.save(serviceRecordPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int lockQuotation(QuotationVO quotationVO, String userId) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		quotationPO.setStatus(QuotationPO.STATUS_LOCK_INT);
		
		quotationDao.update(quotationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int unlockQuotation(QuotationVO quotationVO, String userId) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		quotationPO.setStatus(QuotationPO.STATUS_INIT_INT);
		
		quotationDao.update(quotationPO);
		
		ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
		serviceRecordPO.setType(ServiceRecordPO.TYPE_CHANGE_QUOTATION_INT);
		serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		serviceRecordPO.setOperateUserId(userId);
		serviceRecordPO.setInfo(String.format("装修单:%s,报价ID%d,解锁", quotationPO.getOrderId(), quotationPO.getQid()));
		
		serviceRecordDao.save(serviceRecordPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int cloneQuotation(QuotationVO quotationVO, String no,String userId,int company) throws FLException {
		
		String orderId = quotationVO.getOrderId();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		QuotationPO quotationPO = new QuotationPO();
		
		QuotetionPO copyQuotetionPO = quotetionDao.queryQuotetionByNo(no);
		
		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);
		
		if(copyQuotetionPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		SystemConfigPO quotetionlimit = systemConfigDao.querySystemConfig("quotetionlimit", company);
		
		if(quotetionDao.countQuotetionByCuid(userPO.getUid()) >= (quotetionlimit == null ? 10 : Integer.parseInt(quotetionlimit.getValue()))){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company);
		
		if(decorationPO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}
		
		quotationPO.ptp(orderId,userPO,copyQuotetionPO.getName(),"其他");
		
		if(!decorationPO.getVersion().getNo().equals(copyQuotetionPO.getVersion())){
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(defaultQuotationPO != null){
			deleteQuotationByQId(defaultQuotationPO.getQid());
		}
		
		quotationDao.save(quotationPO);

		copyQuotetion(quotationPO.getQid(),copyQuotetionPO.getQid());
		
		BeanUtil.copyProperties(quotationPO,quotationVO, Arrays.asList("creater"));
		
		return 0;
	}

	@Transactional(rollbackFor=Exception.class)
	private int copyQuotetion(long quotationId, long quotetionId)throws FLException{
		
		List<QuotetionFunctionAreaPO> quotetionFunctionAreaPOs = quotetionFunctionAreaDao.queryQuotetionFunctionAreaByQuotetionId(quotetionId);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		for(QuotetionFunctionAreaPO quotetionFunctionAreaPO: quotetionFunctionAreaPOs){
			
			QuotationFunctionAreaPO _quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			_quotationFunctionAreaPO.setFunctionAreaName(quotetionFunctionAreaPO.getName());
			_quotationFunctionAreaPO.setFunctionAreaOrder(quotetionFunctionAreaPO.getIndex());
			_quotationFunctionAreaPO.setType(quotetionFunctionAreaPO.getType());
			_quotationFunctionAreaPO.setQuotation(new QuotationPO(quotationId));	
			_quotationFunctionAreaPO.setTotal(0f);	
			_quotationFunctionAreaPO.setQfaId(quotationId);	
		
			quotationFunctionAreaDao.save(_quotationFunctionAreaPO);
		
			List<QuotetionFunctionAreaItemPO> quotetionFunctionAreaItemPOs = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByFunctionAreaId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), divisor),quotetionFunctionAreaPO.getQfaId());
			
			for(QuotetionFunctionAreaItemPO quotetionFunctionAreaItem: quotetionFunctionAreaItemPOs){
				
				QuotationFunctionAreaItemPO clazz = QuotationFunctionAreaItemPO.factoryToInstance(_quotationFunctionAreaPO.getQfaId(), divisor);

				clazz.setQuotationFunctionArea(_quotationFunctionAreaPO);
				
				if(quotetionFunctionAreaItem.getQiid() != 0 ){
					clazz.setQuotationItem(quotationItemDao.get(quotetionFunctionAreaItem.getQiid()));
				}
				
				clazz.ptp(quotetionFunctionAreaItem);
				
				quotationFunctionAreaItemDao.save(clazz);
			}
		}
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int replicaQuotation(QuotationVO quotationVO, String userId, int company) throws FLException{
		
		long replicaQId = quotationVO.getQid();
		
		QuotationPO quotationPO = new QuotationPO();
		
		String orderId = quotationVO.getOrderId();
		
		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);
		
		QuotationPO copyQuotationPO = quotationDao.get(replicaQId);
		
		if(copyQuotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		DecorationPO _decorationPO = decorationDao.queryDecorationByOrderId(copyQuotationPO.getOrderId());
		
		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company);
		
		if(quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company);
		
		if(decorationPO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}
		
		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("qid","creater"));
		
		quotationPO.ptp(orderId, userDao.queryUserByUserId(userId), copyQuotationPO.getQuotationName(), copyQuotationPO.getDecorationStyle());

		if(orderId.equals(copyQuotationPO.getOrderId())){
			throw new FLException(200019, "拷贝报价不能在订单内完成");
		}
		
		if(!decorationPO.getVersion().getNo().equals(_decorationPO.getVersion().getNo())){
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(defaultQuotationPO != null){
			deleteQuotationByQId(defaultQuotationPO.getQid());
		}
		
		quotationDao.save(quotationPO);
		
		copyQuotation(replicaQId, quotationPO.getQid());
		
		BeanUtil.copyProperties(quotationPO,quotationVO, Arrays.asList("creater"));
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int copyQuotation(QuotationVO quotationVO, String userId, int company) throws FLException{
		
		long copyQId = quotationVO.getQid();
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();

		DecorationPO decorationPO = checkQuotationForDefaultByOrderId(orderId);
		
		checkQuotationForStatusByEnabled(copyQId);
	
		SystemConfigPO quotationlimit = systemConfigDao.querySystemConfig("quotationlimit", company); // 报价数量限制
		
		if(quotationDao.countQuotationByOrderId(orderId) >= (quotationlimit == null ? 3 : Integer.parseInt(quotationlimit.getValue()))){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		SystemConfigPO quotationtimelimit = systemConfigDao.querySystemConfig("quotationtimelimit", company); // 报价复制/拷贝次数限制
		
		if(decorationPO.getQuotationTimeLimit() >= (quotationtimelimit == null ? 3 : Integer.parseInt(quotationtimelimit.getValue()))){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}
		
		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("qid","creater"));
		quotationPO.setOrderId(orderId);
		quotationPO.setCreater(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		QuotationPO copyPO = quotationDao.get(copyQId);
		quotationPO.setDiscount(copyPO.getDiscount());
		quotationPO.setTotalPrice(copyPO.getTotalPrice());
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		if(defaultQuotationPO == null){
			quotationPO.setDefaults(QuotationPO.DEFAULTS_DEFAULT_INT);
		}else{
			quotationPO.setDefaults(QuotationPO.DEFAULTS_NONDEFAULT_INT);
		}
		quotationDao.save(quotationPO);
		
		copyQuotation(copyQId, quotationPO.getQid());
		
		BeanUtil.copyProperties(quotationPO, quotationVO,Arrays.asList("creater"));
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationById(QuotationVO quotationVO) throws FLException{	
		
		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid());
		
		checkQuotationForDefaultByOrderId(quotationPO.getOrderId());
		
		if(quotationPO.getDefaults() == QuotationPO.DEFAULTS_DEFAULT_INT){
			throw new FLException(200014, "默认报价不能删除");
		}
		
		deleteQuotationByQId(quotationVO.getQid());
		
		return 0;
	}
	
	public static void convertQuotationVOToPOForAdvance(QuotationVO quotationVO, QuotationPO quotationPO){
		
		quotationPO.setDiscount(quotationVO.getDiscount());
		quotationPO.setTotalPrice(quotationVO.getTotalPrice());
		quotationPO.setManagePrice(quotationVO.getManagePrice());
		quotationPO.setManageRate(quotationVO.getManageRate());
		quotationPO.setTrafficPrice(quotationVO.getTrafficPrice());
		quotationPO.setUndisPrice(quotationVO.getUndisPrice());
		quotationPO.setTrafficRate(quotationVO.getTrafficRate());
		quotationPO.setDisPrice(quotationVO.getDisPrice());
		quotationPO.setBasePrice(quotationVO.getBasePrice());
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int copyQuotation(long quotationId, long newQuotationId)throws FLException{

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
			
			QuotationFunctionAreaPO _quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			BeanUtil.copyProperties(quotationFunctionAreaPO, _quotationFunctionAreaPO, Arrays.asList("qfaId"));
			_quotationFunctionAreaPO.setQuotation(new QuotationPO(newQuotationId));		
			
			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), divisor),quotationFunctionAreaPO.getQfaId());
			
			quotationFunctionAreaDao.save(_quotationFunctionAreaPO);
			
			for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){
				
				QuotationFunctionAreaItemPO clazz = QuotationFunctionAreaItemPO.factoryToInstance(_quotationFunctionAreaPO.getQfaId(), divisor);

				BeanUtil.copyProperties(quotationFunctionAreaItemPO, clazz, Arrays.asList("qfaiId"));
				clazz.setQuotationFunctionArea(_quotationFunctionAreaPO);
				quotationFunctionAreaItemDao.save(clazz);
			}
		}
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int deleteQuotationByQId(long qId)throws FLException{
		
		List<QuotationFunctionAreaPO> quotationFunctionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(qId);
		long extensionNum = extensionItemDao.countQuotationFunctionAreaByEids(quotationFunctionAreas);
		if(extensionNum>0){
			throw new FLException(200028, "功能区存在拓展项");
		}	
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreas){
			long quotatoinFunctionAreaId = quotationFunctionAreaPO.getQfaId();
			String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(),divisor);
			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(tableName,quotatoinFunctionAreaId); // 删除报价项
			quotationFunctionAreaDao.deleteById(quotatoinFunctionAreaId); // 删除功能区
		}
		
		quotationDao.deleteById(qId); // 删除报价
		
		return 0;
	}
	
	private void convertQuotationPOForAdvance(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO,String itemName, String measurementUnit, String workType, float unitPrice, String formula ,float num, short type, short discount, QuotationFunctionAreaPO quotationFunctionArea, String content,short subtype){
		quotationFunctionAreaItemPO.setItemName(itemName);
		quotationFunctionAreaItemPO.setMeasurementUnit(measurementUnit);
		quotationFunctionAreaItemPO.setWorkType(workType);
		quotationFunctionAreaItemPO.setUnitPrice(unitPrice);
		quotationFunctionAreaItemPO.setFormula(formula);
		quotationFunctionAreaItemPO.setNum(num);
		quotationFunctionAreaItemPO.setType(type);
		quotationFunctionAreaItemPO.setDiscount(discount);
		quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionArea);
		quotationFunctionAreaItemPO.setContent(content);
		quotationFunctionAreaItemPO.setSubtype(subtype);
	}
	
	private void  handleQuotation(QuotationVO quotationVO,QuotationPO quotationPO){
		if(quotationPO != null){
			
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(quotationPO.getOrderId());
			UserPO createUser = quotationPO.getCreater();
			
			BeanUtil.copyProperties(quotationPO, quotationVO,Arrays.asList("creater"));

			quotationVO.setCreater(createUser.getUid());
			quotationVO.setCreaterName(createUser.getCurrentName());
			quotationVO.setOrderId(decorationPO.getOrderId());
			quotationVO.setOrderAddr(String.format("%s %s", decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber()));
			quotationVO.setCustomerName(decorationPO.getCustomer().getName());
			quotationVO.setDesignerName(decorationPO.getDesigner().getCurrentName());
			quotationVO.setDesignDepartmentName(decorationPO.getDesigner().getDept().getName());
			quotationVO.setHouseArea(decorationPO.getHouse().getBuildArea());
			quotationVO.setNotSalesmanRate(decorationPO.getNotSalesmanRate());
			
			quotationVO.setNo(decorationPO.getVersion().getNo());
			
			if(decorationPO.getSupervisor() != null){
				quotationVO.setSupervisorName(decorationPO.getSupervisor().getCurrentName());
			}
		}
	}
	
	private void handleListQuotation(List<QuotationVO> quotationVOs,List<QuotationPO> quotationPOs,String orderId){
		if(quotationPOs.isEmpty() || quotationPOs == null){
			return;
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		for(QuotationPO quotationPO: quotationPOs){
			QuotationVO _quotationVO = new QuotationVO();

			UserPO createUser = quotationPO.getCreater();
			
			BeanUtil.copyProperties(quotationPO, _quotationVO,Arrays.asList("creater"));
			
			_quotationVO.setCreater(createUser.getUid());
			_quotationVO.setCreaterName(createUser.getCurrentName());
			_quotationVO.setOrderId(quotationPO.getOrderId());
			_quotationVO.setNotSalesmanRate(decorationPO.getNotSalesmanRate());
			_quotationVO.setNo(decorationPO.getVersion().getNo());
			quotationVOs.add(_quotationVO);
		}
	};
	
	private DecorationPO checkQuotationForDefaultByOrderId(String orderId) throws FLException{
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		List<Short> status = Arrays.asList(new Short[]{DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT});
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!status.contains(decorationPO.getStatus())){
			throw new FLException(200005, "报价不能修改");
		}
		
		return decorationPO;
	}
	
	private QuotationPO checkQuotationForStatusByEnabled(long qid)throws FLException{
		QuotationPO quotationPO = quotationDao.get(qid);
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		if(quotationPO.getStatus() == QuotationPO.STATUS_LOCK_INT){
			throw new FLException(200030, "报价状态不可操作");
		}
		
		return quotationPO;
	}

}
