/**
 * @File Name		: QuotationFunctionAreaServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-6
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
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationNormoodDao;
import com.fanglin.quotation.dao.QuotationNormriceDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.NormtionDO;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemAO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemMO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.ExtensionItemVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("normtionService")
@Transactional(readOnly = true)
public class NormtionServiceImpl implements NormtionService {

	@Autowired
	private QuotationNormoodDao quotationNormoodDao;

	@Autowired
	private QuotationNormriceDao quotationNormriceDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private ExtensionDao extensionDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private NormtionDao normtionDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private NormriceItemDao normriceItemDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageNormtion(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<NormtionDO> normtionDOs = normtionDao.pageNormtion(paging, filters, company);

		List<NormtionVO> normtionVOs = new ArrayList<NormtionVO>();

		for (NormtionDO normtionDO : normtionDOs) {

			NormtionVO normtionVO = new NormtionVO(new DecorationVO(), new UserBaseVO());

			normtionVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyPropertie(normtionDO, normtionVO, Arrays.asList("decoration", "creater"));

			BeanUtil.copyProperties(normtionDO.getCreater(), normtionVO.getCreater(), Arrays.asList("duty", "dept", "role"));

			normtionDO.getDecoration().ptvcascade(normtionVO.getDecoration());

			normtionVOs.add(normtionVO);
		}
		paging.setData(normtionVOs);

	}

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationNormood(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<?> quotationFunctionAreaItemAOs = quotationNormoodDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object quotationFunctionAreaItemAO : quotationFunctionAreaItemAOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemAO;

				QuotationFunctionAreaItemAO item = (QuotationFunctionAreaItemAO) data[0];
				NormoodPO normoodPO = (NormoodPO) data[1];
				NoodsPO noodsPO = (NoodsPO) data[2];

				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO(new NormoodVO(new NoodsVO(), null));

				BeanUtil.copyProperties(item, quotationFunctionAreaItemVO, Arrays.asList("normood", "normrice"));

				BeanUtil.copyProperties(normoodPO, quotationFunctionAreaItemVO.getNormood(), Arrays.asList("noods", "quotationItem"));
				BeanUtil.copyProperties(noodsPO, quotationFunctionAreaItemVO.getNormood().getNoods(), Arrays.asList("quotationItem"));

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	public List<ExtensionVO> queryExtensionNormood(ExtensionVO extensionVO) throws FLException {

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());
		List<ExtensionVO> extensionVOs = new ArrayList<ExtensionVO>();

		for (ExtensionPO extensionPO : extensionPOs) {

			extensionVO = new ExtensionVO();

			BeanUtil.copyPropertie(extensionPO, extensionVO, Arrays.asList("creater"));

			List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();
			List<?> extensionItemAOs = quotationNormoodDao.queryExtensionItem(extensionPO.getEid());

			for (Object extensionItemAO : extensionItemAOs) {

				Object[] data = (Object[]) extensionItemAO;

				ExtensionItemPO extensionItemPO = (ExtensionItemPO) data[0];
				NormoodPO normoodPO = (NormoodPO) data[1];
				NoodsPO noodsPO = (NoodsPO) data[2];

				ExtensionItemVO extensionItemVO = new ExtensionItemVO(new NormoodVO(new NoodsVO(), null));

				BeanUtil.copyProperties(extensionItemPO, extensionItemVO, Arrays.asList("quotationFunctionArea"));

				BeanUtil.copyProperties(normoodPO, extensionItemVO.getNormood(), Arrays.asList("noods", "quotationItem"));
				BeanUtil.copyProperties(noodsPO, extensionItemVO.getNormood().getNoods(), Arrays.asList("quotationItem"));

				extensionItemVO.setQuotationFunctionAreaId(extensionItemPO.getQuotationFunctionArea().getQfaId());
				extensionItemVO.setQuotationFunctionAreaName(extensionItemPO.getQuotationFunctionArea().getFunctionAreaName());

				extensionItemVOs.add(extensionItemVO);
			}

			extensionVO.setExtensionItems(extensionItemVOs);

			extensionVOs.add(extensionVO);
		}

		return extensionVOs;
	}

	@Override
	public List<AddReduceVO> queryAddReduceNormood(AddReduceVO addReduceVO) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		for (AddReducePO addReducePO : addReducePOs) {

			addReduceVO = new AddReduceVO();

			BeanUtil.copyPropertie(addReducePO, addReduceVO, Arrays.asList("creater", "constructionNode"));

			List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
			List<?> addReduceItemAOs = quotationNormoodDao.queryAddReduceItem(addReducePO.getArId());

			for (Object addReduceItemAO : addReduceItemAOs) {

				Object[] data = (Object[]) addReduceItemAO;

				AddReduceItemPO addReduceItemPO = (AddReduceItemPO) data[0];
				NormoodPO normoodPO = (NormoodPO) data[1];
				NoodsPO noodsPO = (NoodsPO) data[2];

				AddReduceItemVO addReduceItemVO = new AddReduceItemVO(new NormoodVO(new NoodsVO(), null));

				BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);

				BeanUtil.copyProperties(normoodPO, addReduceItemVO.getNormood(), Arrays.asList("noods", "quotationItem"));
				BeanUtil.copyProperties(noodsPO, addReduceItemVO.getNormood().getNoods(), Arrays.asList("quotationItem"));

				addReduceItemVO.setQuotationFunctionAreaId(addReduceItemPO.getQuotationFunctionArea().getQfaId());
				addReduceItemVO.setQuotationFunctionAreaName(addReduceItemPO.getQuotationFunctionArea().getFunctionAreaName());

				addReduceItemVOs.add(addReduceItemVO);
			}

			addReduceVO.setAddReduceItems(addReduceItemVOs);

			addReduceVOs.add(addReduceVO);
		}

		return addReduceVOs;
	}

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationNormrice(QuotationVO quotationVO, Short schedule) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<?> quotationFunctionAreaItemMOs = quotationNormriceDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId(), schedule);

			for (Object quotationFunctionAreaItemMO : quotationFunctionAreaItemMOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemMO;

				QuotationFunctionAreaItemMO item = (QuotationFunctionAreaItemMO) data[0];
				NormricePO normricePO = (NormricePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO(new NormriceVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(item, quotationFunctionAreaItemVO, Arrays.asList("normood", "normrice"));

				BeanUtil.copyProperties(normricePO, quotationFunctionAreaItemVO.getNormrice(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, quotationFunctionAreaItemVO.getNormrice().getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	public List<ExtensionVO> queryExtensionNormrice(ExtensionVO extensionVO, Short schedule) throws FLException {

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());
		List<ExtensionVO> extensionVOs = new ArrayList<ExtensionVO>();

		for (ExtensionPO extensionPO : extensionPOs) {

			extensionVO = new ExtensionVO();

			BeanUtil.copyPropertie(extensionPO, extensionVO, Arrays.asList("creater"));

			List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();
			List<?> extensionItemMOs = quotationNormriceDao.queryExtensionItem(extensionPO.getEid(), schedule);

			for (Object extensionItemMO : extensionItemMOs) {

				Object[] data = (Object[]) extensionItemMO;

				ExtensionItemPO extensionItemPO = (ExtensionItemPO) data[0];
				NormricePO normricePO = (NormricePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				ExtensionItemVO extensionItemVO = new ExtensionItemVO(new NormriceVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(extensionItemPO, extensionItemVO, Arrays.asList("quotationFunctionArea"));

				BeanUtil.copyProperties(normricePO, extensionItemVO.getNormrice(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, extensionItemVO.getNormrice().getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				extensionItemVO.setQuotationFunctionAreaId(extensionItemPO.getQuotationFunctionArea().getQfaId());
				extensionItemVO.setQuotationFunctionAreaName(extensionItemPO.getQuotationFunctionArea().getFunctionAreaName());

				extensionItemVOs.add(extensionItemVO);
			}

			extensionVO.setExtensionItems(extensionItemVOs);

			extensionVOs.add(extensionVO);
		}

		return extensionVOs;
	}

	@Override
	public List<AddReduceVO> queryAddReduceNormrice(AddReduceVO addReduceVO, Short schedule) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		Short status = addReduceVO.getStatus();

		for (AddReducePO addReducePO : addReducePOs) {

			if (status == null && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus()) && addReducePO.getType() == AddReducePO.TYPE_ADD_INT && addReducePO.getPaytype() == AddReducePO.PAYTYPE_PAY_INT) continue;

			addReduceVO = new AddReduceVO();

			BeanUtil.copyPropertie(addReducePO, addReduceVO, Arrays.asList("creater", "constructionNode"));

			List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
			List<?> addReduceItemAOs = quotationNormriceDao.queryAddReduceItem(addReducePO.getArId(), schedule);

			for (Object addReduceItemAO : addReduceItemAOs) {

				Object[] data = (Object[]) addReduceItemAO;

				AddReduceItemPO addReduceItemPO = (AddReduceItemPO) data[0];
				NormricePO normricePO = (NormricePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				AddReduceItemVO addReduceItemVO = new AddReduceItemVO(new NormriceVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);

				BeanUtil.copyProperties(normricePO, addReduceItemVO.getNormrice(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, addReduceItemVO.getNormrice().getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				addReduceItemVO.setQuotationFunctionAreaId(addReduceItemPO.getQuotationFunctionArea().getQfaId());
				addReduceItemVO.setQuotationFunctionAreaName(addReduceItemPO.getQuotationFunctionArea().getFunctionAreaName());

				addReduceItemVOs.add(addReduceItemVO);
			}

			addReduceVO.setAddReduceItems(addReduceItemVOs);

			addReduceVOs.add(addReduceVO);
		}

		return addReduceVOs;
	}

	@Override
	public List<NormoodVO> amountQuotationNormood(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			List<?> normoods = quotationNormoodDao.amountQuotationNormood(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object normood : normoods) {

				Object[] data = (Object[]) normood;

				NormoodPO normoodPO = (NormoodPO) data[0];
				NoodsPO noodsPO = (NoodsPO) data[1];

				Integer normnum = (Integer) data[2];
				Integer storenum = (Integer) data[3];

				Integer initnum = (Integer) data[4];

				NormoodVO normoodVO = new NormoodVO(new NoodsVO(), null);

				BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("noods", "quotationItem", "normnum", "storenum"));
				BeanUtil.copyProperties(noodsPO, normoodVO.getNoods());

				normoodVO.setNormnum(Arith.mul(normnum, initnum));
				normoodVO.setStorenum(Arith.mul(storenum, initnum));

				normoodVOs.add(normoodVO);
			}
		}

		return normoodVOs;
	}

	@Override
	public List<NormoodVO> amountExtensionNormood(ExtensionVO extensionVO) throws FLException {

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());

		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (ExtensionPO extensionPO : extensionPOs) {

			List<?> normoods = quotationNormoodDao.amountExtensionNormood(extensionPO.getEid());

			for (Object normood : normoods) {

				Object[] data = (Object[]) normood;

				NormoodPO normoodPO = (NormoodPO) data[0];
				NoodsPO noodsPO = (NoodsPO) data[1];

				Integer normnum = (Integer) data[2];
				Integer storenum = (Integer) data[3];

				Integer num = (Integer) data[4];

				NormoodVO normoodVO = new NormoodVO(new NoodsVO(), null);

				BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("noods", "quotationItem", "normnum", "storenum"));
				BeanUtil.copyProperties(noodsPO, normoodVO.getNoods());

				normoodVO.setNormnum(Arith.mul(normnum, num));
				normoodVO.setStorenum(Arith.mul(storenum, num));

				normoodVOs.add(normoodVO);
			}
		}

		return normoodVOs;
	}

	@Override
	public List<NormoodVO> amountAddReduceNormood(AddReduceVO addReduceVO) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());

		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (AddReducePO addReducePO : addReducePOs) {

			List<?> normoods = quotationNormoodDao.amountAddReduceNormood(addReducePO.getArId());

			for (Object normood : normoods) {

				Object[] data = (Object[]) normood;

				NormoodPO normoodPO = (NormoodPO) data[0];
				NoodsPO noodsPO = (NoodsPO) data[1];

				Integer normnum = (Integer) data[2];
				Integer storenum = (Integer) data[3];

				Integer num = (Integer) data[4];

				NormoodVO normoodVO = new NormoodVO(new NoodsVO(), null);

				BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("noods", "quotationItem", "normnum", "storenum"));
				BeanUtil.copyProperties(noodsPO, normoodVO.getNoods());

				normoodVO.setNormnum(Arith.mul(normnum, num));
				normoodVO.setStorenum(Arith.mul(storenum, num));

				normoodVOs.add(normoodVO);
			}
		}

		return normoodVOs;
	}

	@Override
	public List<NormriceVO> amountQuotationNormrice(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		List<NormriceVO> normriceVOs = new ArrayList<NormriceVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			List<?> normrices = quotationNormriceDao.amountQuotationNormrice(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object normrice : normrices) {

				Object[] data = (Object[]) normrice;

				NormricePO normricePO = (NormricePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Long amount = (Long) data[2];
				Integer stuff = (Integer) data[3];
				Integer num = (Integer) data[4];

				NormriceVO normriceVO = new NormriceVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normricePO, normriceVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normriceVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				normriceVO.setAmount(amount);
				normriceVO.setStuff(stuff);
				normriceVO.setNum(num);

				normriceVOs.add(normriceVO);
			}
		}

		return normriceVOs;
	}

	@Override
	public List<NormriceVO> amountExtensionNormrice(ExtensionVO extensionVO) throws FLException {

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());

		List<NormriceVO> normriceVOs = new ArrayList<NormriceVO>();

		for (ExtensionPO extensionPO : extensionPOs) {

			List<?> normrices = quotationNormriceDao.amountExtensionNormrice(extensionPO.getEid());

			for (Object normrice : normrices) {

				Object[] data = (Object[]) normrice;

				NormricePO normricePO = (NormricePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Long amount = (Long) data[2];
				Integer stuff = (Integer) data[3];
				Integer num = (Integer) data[4];

				NormriceVO normriceVO = new NormriceVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normricePO, normriceVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normriceVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				normriceVO.setAmount(amount);
				normriceVO.setStuff(stuff);
				normriceVO.setNum(num);

				normriceVOs.add(normriceVO);
			}
		}

		return normriceVOs;
	}

	@Override
	public List<NormriceVO> amountAddReduceNormrice(AddReduceVO addReduceVO) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());

		List<NormriceVO> normriceVOs = new ArrayList<NormriceVO>();

		for (AddReducePO addReducePO : addReducePOs) {

			List<?> normrices = quotationNormriceDao.amountAddReduceNormrice(addReducePO.getArId());

			for (Object normrice : normrices) {

				Object[] data = (Object[]) normrice;

				NormricePO normricePO = (NormricePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Long amount = (Long) data[2];
				Integer stuff = (Integer) data[3];
				Integer num = (Integer) data[4];

				NormriceVO normriceVO = new NormriceVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normricePO, normriceVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normriceVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				normriceVO.setAmount(amount);
				normriceVO.setStuff(stuff);
				normriceVO.setNum(num);

				normriceVOs.add(normriceVO);
			}
		}

		return normriceVOs;
	}

	@Override
	public NormtionVO queryNormtion(NormtionVO normtionVO) throws FLException {

		NormtionPO normtionPO = normtionDao.queryNormtion(normtionVO.getQid());

		if (normtionPO == null) {
			throw new FLException(200071, "报价定额不存在");
		}

		BeanUtil.copyPropertie(normtionPO, normtionVO, Arrays.asList("creater"));

		return normtionVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeNormtion(NormtionVO normtionVO, String userId) throws FLException {

		NormtionPO normtionPO = normtionDao.queryNormtion(normtionVO.getQid());

		if (normtionPO == null) {
			normtionPO = new NormtionPO();

			BeanUtil.copyPropertie(normtionVO, normtionVO, Arrays.asList("creater"));

			normtionPO.setQid(normtionVO.getQid());
			normtionPO.setOrderId(normtionVO.getOrderId());

			normtionPO.setCreater(userDao.queryUserByUserId(userId));
			normtionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			normtionDao.save(normtionPO);
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(normtionPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_FINISH_INT) {

			normoodItemDao.deleteNormoodItem(normtionPO.getQid(), NormoodItemPO.TYPE_OFFER_INT, NormoodItemPO.STATUS_DISABLED_INT);
			normoodItemDao.deleteNormoodItem(normtionPO.getQid(), NormoodItemPO.TYPE_EXPAND_INT, NormoodItemPO.STATUS_DISABLED_INT);
			normoodItemDao.deleteNormoodItem(normtionPO.getQid(), NormoodItemPO.TYPE_ADDCUT_INT, NormoodItemPO.STATUS_DISABLED_INT);

			normriceItemDao.deleteNormriceItem(normtionPO.getQid(), NormriceItemPO.TYPE_OFFER_INT, NormriceItemPO.STATUS_DISABLED_INT);
			normriceItemDao.deleteNormriceItem(normtionPO.getQid(), NormriceItemPO.TYPE_EXPAND_INT, NormriceItemPO.STATUS_DISABLED_INT);
			normriceItemDao.deleteNormriceItem(normtionPO.getQid(), NormriceItemPO.TYPE_ADDCUT_INT, NormriceItemPO.STATUS_DISABLED_INT);

			return 0;
		}

		normoodItemDao.disableNormoodItem(normtionVO.getQid());
		normriceItemDao.disabledNormriceItem(normtionVO.getQid());

		normoodItemDao.flush();

		normtionVO.setOrderId(normtionPO.getOrderId());

		makeNormtion(normtionVO, null, userId);

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(normtionPO.getOrderId());

		for (ExtensionPO extensionPO : extensionPOs) {
			makeNormtion(normtionVO, new ExtensionVO(extensionPO.getEid()), null, userId);
		}

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(normtionPO.getOrderId());

		for (AddReducePO addReducePO : addReducePOs) {
			makeNormtion(normtionVO, new AddReduceVO(addReducePO.getArId()), null, userId);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeNormtion(NormtionVO normtionVO, Short schedule, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(normtionVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(quotationPO.getQid());

		if (normtionPO == null) {
			addNormtion(normtionVO, userId);
		}

		normoodItemDao.disableNormoodItem(normtionVO.getQid(), NormoodItemPO.TYPE_OFFER_INT);
		normriceItemDao.disabledNormriceItem(normtionVO.getQid(), NormriceItemPO.TYPE_OFFER_INT);

		normoodItemDao.flush();

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(normtionVO.getQid());

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			List<?> quotationFunctionAreaItemAOs = quotationNormoodDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object quotationFunctionAreaItemAO : quotationFunctionAreaItemAOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemAO;

				QuotationFunctionAreaItemAO itemPO = (QuotationFunctionAreaItemAO) data[0];
				NormoodPO normoodPO = (NormoodPO) data[1];
				NoodsPO noodsPO = (NoodsPO) data[2];

				NormoodItemPO normoodItemPO = normoodItemDao.queryNormoodItem(normtionVO.getQid(), itemPO.getQfaiId(), normoodPO.getNgid(), NormoodItemPO.TYPE_OFFER_INT);

				if (normoodItemPO != null) {

					normoodItemPO.setStatus(NormoodItemPO.STATUS_INIT_INT);

					normoodItemPO.setNormunit(normoodPO.getNormunit());
					normoodItemPO.setNormnum(Arith.mul(itemPO.getInitNum(), normoodPO.getNormnum()));
					normoodItemPO.setStoreunit(normoodPO.getStoreunit());
					normoodItemPO.setStorenum(Arith.mul(itemPO.getInitNum(), normoodPO.getStorenum()));

					normoodItemDao.update(normoodItemPO);

					continue;
				}

				normoodItemPO = new NormoodItemPO();

				normoodItemPO.setQid(normtionVO.getQid());
				normoodItemPO.setSid(normtionVO.getQid());
				normoodItemPO.setAreald(itemPO.getQuotationFunctionAreaId());
				normoodItemPO.setQuoteld(itemPO.getQfaiId());
				normoodItemPO.setQiid(itemPO.getQuotationItemId());
				normoodItemPO.setNgid(normoodPO.getNgid());

				normoodItemPO.setType(NormoodItemPO.TYPE_OFFER_INT);
				normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_MATERIAL_INT);
				normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);

				normoodItemPO.setNormunit(normoodPO.getNormunit());
				normoodItemPO.setNormnum(Arith.mul(itemPO.getInitNum(), normoodPO.getNormnum()));
				normoodItemPO.setStoreunit(normoodPO.getStoreunit());
				normoodItemPO.setStorenum(Arith.mul(itemPO.getInitNum(), normoodPO.getStorenum()));
				normoodItemPO.setNoods(noodsPO);

				normoodItemDao.save(normoodItemPO);
			}

			List<?> quotationFunctionAreaItemMOs = quotationNormriceDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId(), schedule);

			for (Object quotationFunctionAreaItemMO : quotationFunctionAreaItemMOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemMO;

				QuotationFunctionAreaItemMO item = (QuotationFunctionAreaItemMO) data[0];
				NormricePO normricePO = (NormricePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				NormriceItemPO normriceItemPO = normriceItemDao.queryNormriceItem(normtionVO.getQid(), item.getQfaiid(), normricePO.getNpid(), NormriceItemPO.TYPE_OFFER_INT);

				if (normriceItemPO != null) {

					normriceItemPO.setStatus(NormriceItemPO.STATUS_INIT_INT);

					normriceItemPO.setConstructionNode(constructionNodePO);

					normriceItemPO.setName(constructionNodePO.getName());
					normriceItemPO.setUnit(normricePO.getUnit());
					normriceItemPO.setTrannum(normricePO.getTrannum());
					normriceItemPO.setSalary(normricePO.getSalary());
					normriceItemPO.setNum(item.getInitNum());

					normriceItemDao.update(normriceItemPO);

					continue;
				}

				normriceItemPO = new NormriceItemPO();

				normriceItemPO.setQid(normtionVO.getQid());
				normriceItemPO.setSid(normtionVO.getQid());
				normriceItemPO.setAreald(item.getQuotationFunctionAreaId());
				normriceItemPO.setQuoteld(item.getQfaiid());
				normriceItemPO.setQiid(item.getQuotationItemId());
				normriceItemPO.setNpid(normricePO.getNpid());

				normriceItemPO.setType(NormriceItemPO.TYPE_OFFER_INT);
				normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_WORKFEE_INT);
				normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_COLLECTION_INT);

				normriceItemPO.setConstructionNode(constructionNodePO);

				normriceItemPO.setName(constructionNodePO.getName());
				normriceItemPO.setUnit(normricePO.getUnit());
				normriceItemPO.setTrannum(normricePO.getTrannum());
				normriceItemPO.setSalary(normricePO.getSalary());
				normriceItemPO.setNum(item.getInitNum());

				normriceItemDao.save(normriceItemPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeNormtion(NormtionVO normtionVO, ExtensionVO extensionVO, Short schedule, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(normtionVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(quotationPO.getQid());

		if (normtionPO == null) {
			addNormtion(normtionVO, userId);
		}

		normoodItemDao.disableNormoodItem(normtionVO.getQid(), extensionVO.getEid(), NormoodItemPO.TYPE_EXPAND_INT);
		normriceItemDao.disabledNormriceItem(normtionVO.getQid(), extensionVO.getEid(), NormriceItemPO.TYPE_EXPAND_INT);

		normoodItemDao.flush();

		List<?> extensionItemAOs = quotationNormoodDao.queryExtensionItem(extensionVO.getEid());

		for (Object extensionItemAO : extensionItemAOs) {

			Object[] data = (Object[]) extensionItemAO;

			ExtensionItemPO itemPO = (ExtensionItemPO) data[0];
			NormoodPO normoodPO = (NormoodPO) data[1];
			NoodsPO noodsPO = (NoodsPO) data[2];

			NormoodItemPO normoodItemPO = normoodItemDao.queryNormoodItem(normtionVO.getQid(), itemPO.getEiid(), normoodPO.getNgid(), NormoodItemPO.TYPE_EXPAND_INT);

			if (normoodItemPO != null) {

				normoodItemPO.setStatus(NormoodItemPO.STATUS_INIT_INT);

				normoodItemPO.setNormunit(normoodPO.getNormunit());
				normoodItemPO.setNormnum(Arith.mul(itemPO.getInitnum(), normoodPO.getNormnum()));
				normoodItemPO.setStoreunit(normoodPO.getStoreunit());
				normoodItemPO.setStorenum(Arith.mul(itemPO.getInitnum(), normoodPO.getStorenum()));

				normoodItemDao.update(normoodItemPO);

				continue;
			}

			normoodItemPO = new NormoodItemPO();

			normoodItemPO.setQid(normtionVO.getQid());
			normoodItemPO.setSid(itemPO.getEid());
			normoodItemPO.setAreald(itemPO.getQuotationFunctionArea().getQfaId());
			normoodItemPO.setQuoteld(itemPO.getEiid());
			normoodItemPO.setQiid(itemPO.getQiid());
			normoodItemPO.setNgid(normoodPO.getNgid());

			normoodItemPO.setType(NormoodItemPO.TYPE_EXPAND_INT);
			normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_MATERIAL_INT);

			if (Arrays.asList(ExtensionItemPO.TYPE_ADD_DATA_INT, ExtensionItemPO.TYPE_ADD_CUSTOM_INT, ExtensionItemPO.TYPE_ADD_QUOTE_INT).contains(itemPO.getType())) {
				normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);
			} else {
				normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_SUB_INT);
			}

			normoodItemPO.setNormunit(normoodPO.getNormunit());
			normoodItemPO.setNormnum(Arith.mul(itemPO.getInitnum(), normoodPO.getNormnum()));
			normoodItemPO.setStoreunit(normoodPO.getStoreunit());
			normoodItemPO.setStorenum(Arith.mul(itemPO.getInitnum(), normoodPO.getStorenum()));
			normoodItemPO.setNoods(noodsPO);

			normoodItemDao.save(normoodItemPO);
		}

		List<?> extensionItemMOs = quotationNormriceDao.queryExtensionItem(extensionVO.getEid(), schedule);

		for (Object extensionItemMO : extensionItemMOs) {

			Object[] data = (Object[]) extensionItemMO;

			ExtensionItemPO itemPO = (ExtensionItemPO) data[0];
			NormricePO normricePO = (NormricePO) data[1];
			ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

			NormriceItemPO normriceItemPO = normriceItemDao.queryNormriceItem(normtionVO.getQid(), itemPO.getEiid(), normricePO.getNpid(), NormriceItemPO.TYPE_EXPAND_INT);

			if (normriceItemPO != null) {

				normriceItemPO.setStatus(NormriceItemPO.STATUS_INIT_INT);

				normriceItemPO.setConstructionNode(constructionNodePO);

				normriceItemPO.setName(constructionNodePO.getName());
				normriceItemPO.setUnit(normricePO.getUnit());
				normriceItemPO.setTrannum(normricePO.getTrannum());
				normriceItemPO.setSalary(normricePO.getSalary());
				normriceItemPO.setNum(itemPO.getInitnum());

				normriceItemDao.update(normriceItemPO);

				continue;
			}

			normriceItemPO = new NormriceItemPO();

			normriceItemPO.setQid(normtionVO.getQid());
			normriceItemPO.setSid(itemPO.getEid());
			normriceItemPO.setAreald(itemPO.getQuotationFunctionArea().getQfaId());
			normriceItemPO.setQuoteld(itemPO.getEiid());
			normriceItemPO.setQiid(itemPO.getQiid());
			normriceItemPO.setNpid(normricePO.getNpid());

			normriceItemPO.setType(NormriceItemPO.TYPE_EXPAND_INT);
			normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_WORKFEE_INT);

			if (Arrays.asList(ExtensionItemPO.TYPE_ADD_DATA_INT, ExtensionItemPO.TYPE_ADD_CUSTOM_INT, ExtensionItemPO.TYPE_ADD_QUOTE_INT).contains(itemPO.getType())) {
				normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_COLLECTION_INT);
			} else {
				normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_SUB_INT);
			}

			normriceItemPO.setConstructionNode(constructionNodePO);

			normriceItemPO.setName(constructionNodePO.getName());
			normriceItemPO.setUnit(normricePO.getUnit());
			normriceItemPO.setTrannum(normricePO.getTrannum());
			normriceItemPO.setSalary(normricePO.getSalary());
			normriceItemPO.setNum(itemPO.getInitnum());

			normriceItemDao.save(normriceItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeNormtion(NormtionVO normtionVO, AddReduceVO addReduceVO, Short schedule, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(normtionVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(quotationPO.getQid());

		if (normtionPO == null) {
			addNormtion(normtionVO, userId);
		}

		normoodItemDao.disableNormoodItem(normtionVO.getQid(), addReduceVO.getArId(), NormoodItemPO.TYPE_ADDCUT_INT);
		normriceItemDao.disabledNormriceItem(normtionVO.getQid(), addReduceVO.getArId(), NormriceItemPO.TYPE_ADDCUT_INT);

		normoodItemDao.flush();

		List<?> addReduceItemAOs = quotationNormoodDao.queryAddReduceItem(addReduceVO.getArId());

		for (Object addReduceItemAO : addReduceItemAOs) {

			Object[] data = (Object[]) addReduceItemAO;

			AddReduceItemPO itemPO = (AddReduceItemPO) data[0];
			NormoodPO normoodPO = (NormoodPO) data[1];
			NoodsPO noodsPO = (NoodsPO) data[2];

			NormoodItemPO normoodItemPO = normoodItemDao.queryNormoodItem(normtionVO.getQid(), itemPO.getAriId(), normoodPO.getNgid(), NormoodItemPO.TYPE_ADDCUT_INT);

			if (normoodItemPO != null) {

				normoodItemPO.setStatus(NormoodItemPO.STATUS_INIT_INT);

				normoodItemPO.setNormunit(normoodPO.getNormunit());
				normoodItemPO.setNormnum(Arith.mul(itemPO.getInitnum(), normoodPO.getNormnum()));
				normoodItemPO.setStoreunit(normoodPO.getStoreunit());
				normoodItemPO.setStorenum(Arith.mul(itemPO.getInitnum(), normoodPO.getStorenum()));

				normoodItemDao.update(normoodItemPO);

				continue;
			}

			normoodItemPO = new NormoodItemPO();

			normoodItemPO.setQid(normtionVO.getQid());
			normoodItemPO.setSid(itemPO.getArId());
			normoodItemPO.setAreald(itemPO.getQuotationFunctionArea().getQfaId());
			normoodItemPO.setQuoteld(itemPO.getAriId());
			normoodItemPO.setQiid(itemPO.getQiid());
			normoodItemPO.setNgid(normoodPO.getNgid());

			normoodItemPO.setType(NormoodItemPO.TYPE_ADDCUT_INT);
			normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_MATERIAL_INT);

			if (Arrays.asList(AddReduceItemPO.TYPE_COMMON_QUOTATION_INT, AddReduceItemPO.TYPE_CUSTOM_QUOTATION_INT).contains(itemPO.getType())) {
				normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);
			} else {
				normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_SUB_INT);
			}

			normoodItemPO.setNormunit(normoodPO.getNormunit());
			normoodItemPO.setNormnum(Arith.mul(itemPO.getInitnum(), normoodPO.getNormnum()));
			normoodItemPO.setStoreunit(normoodPO.getStoreunit());
			normoodItemPO.setStorenum(Arith.mul(itemPO.getInitnum(), normoodPO.getStorenum()));
			normoodItemPO.setNoods(noodsPO);

			normoodItemDao.save(normoodItemPO);
		}

		List<?> addReduceItemMOs = quotationNormriceDao.queryAddReduceItem(addReduceVO.getArId(), schedule);

		for (Object addReduceItemMO : addReduceItemMOs) {

			Object[] data = (Object[]) addReduceItemMO;

			AddReduceItemPO itemPO = (AddReduceItemPO) data[0];
			NormricePO normricePO = (NormricePO) data[1];
			ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

			NormriceItemPO normriceItemPO = normriceItemDao.queryNormriceItem(normtionVO.getQid(), itemPO.getAriId(), normricePO.getNpid(), NormriceItemPO.TYPE_ADDCUT_INT);

			if (normriceItemPO != null) {

				normriceItemPO.setStatus(NormriceItemPO.STATUS_INIT_INT);

				normriceItemPO.setConstructionNode(constructionNodePO);

				normriceItemPO.setName(constructionNodePO.getName());
				normriceItemPO.setUnit(normricePO.getUnit());
				normriceItemPO.setTrannum(normricePO.getTrannum());
				normriceItemPO.setSalary(normricePO.getSalary());
				normriceItemPO.setNum(itemPO.getInitnum());

				normriceItemDao.update(normriceItemPO);

				continue;
			}

			normriceItemPO = new NormriceItemPO();

			normriceItemPO.setQid(normtionVO.getQid());
			normriceItemPO.setSid(itemPO.getArId());
			normriceItemPO.setAreald(itemPO.getQuotationFunctionArea().getQfaId());
			normriceItemPO.setQuoteld(itemPO.getAriId());
			normriceItemPO.setQiid(itemPO.getQiid());
			normriceItemPO.setNpid(normricePO.getNpid());

			normriceItemPO.setType(NormriceItemPO.TYPE_ADDCUT_INT);
			normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_WORKFEE_INT);

			if (Arrays.asList(AddReduceItemPO.TYPE_COMMON_QUOTATION_INT, AddReduceItemPO.TYPE_CUSTOM_QUOTATION_INT).contains(itemPO.getType())) {
				normriceItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);
			} else {
				normriceItemPO.setAtttype(NormoodItemPO.ATTTYPE_SUB_INT);
			}

			normriceItemPO.setConstructionNode(constructionNodePO);

			normriceItemPO.setName(constructionNodePO.getName());
			normriceItemPO.setUnit(normricePO.getUnit());
			normriceItemPO.setTrannum(normricePO.getTrannum());
			normriceItemPO.setSalary(normricePO.getSalary());
			normriceItemPO.setNum(itemPO.getInitnum());

			normriceItemDao.save(normriceItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int printNormtion(NormtionVO normtionVO) throws FLException {

		NormtionPO normtionPO = normtionDao.get(normtionVO.getQid());

		if (normtionPO == null) {
			normtionPO = normtionDao.queryNormtion(normtionVO.getQid());
		}

		if (normtionPO == null) {
			throw new FLException(200071, "报价定额不存在");
		}

		normtionPO.setMoodPrintNum(normtionVO.getMoodPrintNum() + 1);
		normtionPO.setMricePriceNum(normtionVO.getMricePriceNum() + 1);

		normtionDao.update(normtionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormtion(NormtionVO normtionVO, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(normtionVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(normtionVO.getQid());

		if (normtionPO != null) return 0;

		normtionPO = new NormtionPO();

		BeanUtil.copyPropertie(normtionVO, normtionVO, Arrays.asList("creater"));

		normtionPO.setQid(normtionVO.getQid());
		normtionPO.setOrderId(normtionVO.getOrderId());

		normtionPO.setCreater(userDao.queryUserByUserId(userId));
		normtionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		normtionDao.save(normtionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNormtionForStatus(NormtionVO normtionVO) throws FLException {

		NormtionPO normtionPO = normtionDao.get(normtionVO.getNid());

		normtionPO.setStatus(normtionVO.getStatus());

		normtionDao.update(normtionPO);

		return 0;
	}
}
