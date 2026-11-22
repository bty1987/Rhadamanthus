/**


	/** 对方接口固定应用标识(fl-sync 验签, 与优惠额度校验同 appId) */
	private static final String APP_ID = "erp_project_sync";

	/** systemconfig 配置键: 上方定额接口基地址(网关前缀, 代码追加两接口路径); 公司行可覆盖集团行 */
	private static final String KEY_SYNC_URL = "norm.sync.url";

	/** systemconfig 配置键: 公司三方定额补数开关(公司行, value=1 启用; 未配置走现有逻辑) */
	private static final String KEY_SYNC_ENABLE = "norm.sync.enable";

	/** systemconfig 配置键: erp_project_sync 应用密钥(集团行, 复用优惠额度校验既有键禁止重复配) */
	private static final String KEY_APP_SECRET = "cost.app.secret";

	/** 工费清单查询路径 */
	private static final String PATH_LABOR_FEE = "/erp/quotation/labor-fee/get";

	/** 辅料单查询路径 */
	private static final String PATH_AUXILIARY = "/erp/quotation/auxiliary-material-list/get";

	private static final int CONNECT_TIMEOUT = 5000;

	private static final int READ_TIMEOUT = 10000;

	private static final SecureRandom RANDOM = new SecureRandom();
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

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.material.dao.NoodsDao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.po.NormtimePO;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.data.quotation.vo.NormtimeVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.dao.NormtimeItemDao;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationNormoodDao;
import com.fanglin.quotation.dao.QuotationNormriceDao;
import com.fanglin.quotation.dao.QuotationNormtimeDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.NormtimeItemPO;
import com.fanglin.quotation.po.NormtionDO;
import com.fanglin.quotation.po.NormChangeRecordPO;
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
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("normtionService")
@Transactional(readOnly = true)
public class NormtionServiceImpl implements NormtionService {

	private static final Logger log = LoggerFactory.getLogger(NormtionServiceImpl.class);



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
	private NormChangeRecordDao normChangeRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private NormriceItemDao normriceItemDao;

	@Autowired
	private NormtimeItemDao normtimeItemDao;

	@Autowired
	private QuotationNormtimeDao quotationNormtimeDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private NoodsDao noodsDao;

	@Autowired
	private SystemConfigDao systemConfigDao;


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
			throw new FLException(140013, "装修单不存在");
		}

		if (decorationPO.getProjectStatus() == DecorationPO.STATUS_INIT_INT) {

			normoodItemDao.deleteNormoodItem(normtionPO.getQid(), NormoodItemPO.TYPE_OFFER_INT, NormoodItemPO.STATUS_DISABLED_INT);
			normoodItemDao.deleteNormoodItem(normtionPO.getQid(), NormoodItemPO.TYPE_EXPAND_INT, NormoodItemPO.STATUS_DISABLED_INT);
			normoodItemDao.deleteNormoodItem(normtionPO.getQid(), NormoodItemPO.TYPE_ADDCUT_INT, NormoodItemPO.STATUS_DISABLED_INT);

			normriceItemDao.deleteNormriceItem(normtionPO.getQid(), NormriceItemPO.TYPE_OFFER_INT, NormriceItemPO.STATUS_DISABLED_INT);
			normriceItemDao.deleteNormriceItem(normtionPO.getQid(), NormriceItemPO.TYPE_EXPAND_INT, NormriceItemPO.STATUS_DISABLED_INT);
			normriceItemDao.deleteNormriceItem(normtionPO.getQid(), NormriceItemPO.TYPE_ADDCUT_INT, NormriceItemPO.STATUS_DISABLED_INT);

			normtimeItemDao.deleteNormtimeItem(normtionPO.getQid(), NormtimeItemPO.TYPE_OFFER_INT, NormtimeItemPO.STATUS_DISABLED_INT);
			normtimeItemDao.deleteNormtimeItem(normtionPO.getQid(), NormtimeItemPO.TYPE_EXPAND_INT, NormtimeItemPO.STATUS_DISABLED_INT);
			normtimeItemDao.deleteNormtimeItem(normtionPO.getQid(), NormtimeItemPO.TYPE_ADDCUT_INT, NormtimeItemPO.STATUS_DISABLED_INT);

			return 0;
		}

		// 三方定额补数闸(Phase 2 接线): 公司启用且报价无功能区明细时走三方补数, 本地流程结束(必须在 disable 之前, 防三方行被置禁用)
		if (tryNormSyncForQuotation(normtionPO.getOrderId(), userId)) {
			return 0;
		}

		normoodItemDao.disableNormoodItem(normtionVO.getQid());
		normriceItemDao.disabledNormriceItem(normtionVO.getQid());
		normtimeItemDao.disabledNormtimeItem(normtionVO.getQid());

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

		// 三方定额补数闸(Phase 2 接线): 同主入口, makeNormtionForQuotation 直连路径兼容
		if (tryNormSyncForQuotation(normtionVO.getOrderId(), userId)) {
			return 0;
		}

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
		normtimeItemDao.disabledNormtimeItem(normtionVO.getQid(), NormtimeItemPO.TYPE_OFFER_INT);

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

			List<?> quotationFunctionAreaItemTimeMOs = quotationNormtimeDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId(), schedule);

			for (Object quotationFunctionAreaItemTimeMO : quotationFunctionAreaItemTimeMOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemTimeMO;

				QuotationFunctionAreaItemMO item = (QuotationFunctionAreaItemMO) data[0];
				NormtimePO normtimePO = (NormtimePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				NormtimeItemPO normtimeItemPO = normtimeItemDao.queryNormtimeItem(normtionVO.getQid(), item.getQfaiid(), normtimePO.getNtid(), NormtimeItemPO.TYPE_OFFER_INT);

				if (normtimeItemPO != null) {

					normtimeItemPO.setStatus(NormtimeItemPO.STATUS_INIT_INT);

					normtimeItemPO.setConstructionNode(constructionNodePO);

					normtimeItemPO.setName(constructionNodePO.getName());
					normtimeItemPO.setUnit(normtimePO.getUnit());
					normtimeItemPO.setTrannum(normtimePO.getTrannum());
					normtimeItemPO.setWorkdays(normtimePO.getWorkdays().intValue());
					normtimeItemPO.setNum(item.getInitNum());

					normtimeItemDao.update(normtimeItemPO);

					continue;
				}

				normtimeItemPO = new NormtimeItemPO();

				normtimeItemPO.setQid(normtionVO.getQid());
				normtimeItemPO.setSid(normtionVO.getQid());
				normtimeItemPO.setAreald(item.getQuotationFunctionAreaId());
				normtimeItemPO.setQuoteld(item.getQfaiid());
				normtimeItemPO.setQiid(item.getQuotationItemId());
				normtimeItemPO.setNtid(normtimePO.getNtid());

				normtimeItemPO.setType(NormtimeItemPO.TYPE_OFFER_INT);
				normtimeItemPO.setNormtype(NormtimeItemPO.NORMTYPE_WORKDAYS_INT);
				normtimeItemPO.setAtttype(NormtimeItemPO.ATTTYPE_COLLECTION_INT);

				normtimeItemPO.setConstructionNode(constructionNodePO);

				normtimeItemPO.setName(constructionNodePO.getName());
				normtimeItemPO.setUnit(normtimePO.getUnit());
				normtimeItemPO.setTrannum(normtimePO.getTrannum());
				normtimeItemPO.setWorkdays(normtimePO.getWorkdays().intValue());
				normtimeItemPO.setNum(item.getInitNum());

				normtimeItemDao.save(normtimeItemPO);
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
		normtimeItemDao.disabledNormtimeItem(normtionVO.getQid(), extensionVO.getEid(), NormtimeItemPO.TYPE_EXPAND_INT);

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

		List<?> extensionItemTimeMOs = quotationNormtimeDao.queryExtensionItem(extensionVO.getEid(), schedule);

		for (Object extensionItemTimeMO : extensionItemTimeMOs) {

			Object[] data = (Object[]) extensionItemTimeMO;

			ExtensionItemPO itemPO = (ExtensionItemPO) data[0];
			NormtimePO normtimePO = (NormtimePO) data[1];
			ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

			NormtimeItemPO normtimeItemPO = normtimeItemDao.queryNormtimeItem(normtionVO.getQid(), itemPO.getEiid(), normtimePO.getNtid(), NormtimeItemPO.TYPE_EXPAND_INT);

			if (normtimeItemPO != null) {

				normtimeItemPO.setStatus(NormtimeItemPO.STATUS_INIT_INT);

				normtimeItemPO.setConstructionNode(constructionNodePO);

				normtimeItemPO.setName(constructionNodePO.getName());
				normtimeItemPO.setUnit(normtimePO.getUnit());
				normtimeItemPO.setTrannum(normtimePO.getTrannum());
				normtimeItemPO.setWorkdays(normtimePO.getWorkdays().intValue());
				normtimeItemPO.setNum(itemPO.getInitnum());

				normtimeItemDao.update(normtimeItemPO);

				continue;
			}

			normtimeItemPO = new NormtimeItemPO();

			normtimeItemPO.setQid(normtionVO.getQid());
			normtimeItemPO.setSid(itemPO.getEid());
			normtimeItemPO.setAreald(itemPO.getQuotationFunctionArea().getQfaId());
			normtimeItemPO.setQuoteld(itemPO.getEiid());
			normtimeItemPO.setQiid(itemPO.getQiid());
			normtimeItemPO.setNtid(normtimePO.getNtid());

			normtimeItemPO.setType(NormtimeItemPO.TYPE_EXPAND_INT);
			normtimeItemPO.setNormtype(NormtimeItemPO.NORMTYPE_WORKDAYS_INT);

			if (Arrays.asList(ExtensionItemPO.TYPE_ADD_DATA_INT, ExtensionItemPO.TYPE_ADD_CUSTOM_INT, ExtensionItemPO.TYPE_ADD_QUOTE_INT).contains(itemPO.getType())) {
				normtimeItemPO.setAtttype(NormtimeItemPO.ATTTYPE_COLLECTION_INT);
			} else {
				normtimeItemPO.setAtttype(NormtimeItemPO.ATTTYPE_SUB_INT);
			}

			normtimeItemPO.setConstructionNode(constructionNodePO);

			normtimeItemPO.setName(constructionNodePO.getName());
			normtimeItemPO.setUnit(normtimePO.getUnit());
			normtimeItemPO.setTrannum(normtimePO.getTrannum());
			normtimeItemPO.setWorkdays(normtimePO.getWorkdays().intValue());
			normtimeItemPO.setNum(itemPO.getInitnum());

			normtimeItemDao.save(normtimeItemPO);
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
		normtimeItemDao.disabledNormtimeItem(normtionVO.getQid(), addReduceVO.getArId(), NormtimeItemPO.TYPE_ADDCUT_INT);

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

		List<?> addReduceItemTimeMOs = quotationNormtimeDao.queryAddReduceItem(addReduceVO.getArId(), schedule);

		for (Object addReduceItemTimeMO : addReduceItemTimeMOs) {

			Object[] data = (Object[]) addReduceItemTimeMO;

			AddReduceItemPO itemPO = (AddReduceItemPO) data[0];
			NormtimePO normtimePO = (NormtimePO) data[1];
			ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

			NormtimeItemPO normtimeItemPO = normtimeItemDao.queryNormtimeItem(normtionVO.getQid(), itemPO.getAriId(), normtimePO.getNtid(), NormtimeItemPO.TYPE_ADDCUT_INT);

			if (normtimeItemPO != null) {

				normtimeItemPO.setStatus(NormtimeItemPO.STATUS_INIT_INT);

				normtimeItemPO.setConstructionNode(constructionNodePO);

				normtimeItemPO.setName(constructionNodePO.getName());
				normtimeItemPO.setUnit(normtimePO.getUnit());
				normtimeItemPO.setTrannum(normtimePO.getTrannum());
				normtimeItemPO.setWorkdays(normtimePO.getWorkdays().intValue());
				normtimeItemPO.setNum(itemPO.getInitnum());

				normtimeItemDao.update(normtimeItemPO);

				continue;
			}

			normtimeItemPO = new NormtimeItemPO();

			normtimeItemPO.setQid(normtionVO.getQid());
			normtimeItemPO.setSid(itemPO.getArId());
			normtimeItemPO.setAreald(itemPO.getQuotationFunctionArea().getQfaId());
			normtimeItemPO.setQuoteld(itemPO.getAriId());
			normtimeItemPO.setQiid(itemPO.getQiid());
			normtimeItemPO.setNtid(normtimePO.getNtid());

			normtimeItemPO.setType(NormtimeItemPO.TYPE_ADDCUT_INT);
			normtimeItemPO.setNormtype(NormtimeItemPO.NORMTYPE_WORKDAYS_INT);

			if (Arrays.asList(AddReduceItemPO.TYPE_COMMON_QUOTATION_INT, AddReduceItemPO.TYPE_CUSTOM_QUOTATION_INT).contains(itemPO.getType())) {
				normtimeItemPO.setAtttype(NormtimeItemPO.ATTTYPE_COLLECTION_INT);
			} else {
				normtimeItemPO.setAtttype(NormtimeItemPO.ATTTYPE_SUB_INT);
			}

			normtimeItemPO.setConstructionNode(constructionNodePO);

			normtimeItemPO.setName(constructionNodePO.getName());
			normtimeItemPO.setUnit(normtimePO.getUnit());
			normtimeItemPO.setTrannum(normtimePO.getTrannum());
			normtimeItemPO.setWorkdays(normtimePO.getWorkdays().intValue());
			normtimeItemPO.setNum(itemPO.getInitnum());

			normtimeItemDao.save(normtimeItemPO);
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
	public int updateNormtionForStatus(NormtionVO normtionVO, String userId) throws FLException {

		NormtionPO normtionPO = normtionDao.get(normtionVO.getNid());

		if (normtionPO == null) {
			throw new FLException(200013, "定额单不存在");
		}

		short oldStatus = normtionPO.getStatus();

		if (oldStatus != normtionVO.getStatus()) {

			normtionPO.setStatus(normtionVO.getStatus());

			normtionDao.update(normtionPO);

			// 变更记录: 定额单启用/禁用
			normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NORMTION_STATUS_INT, normtionVO.getStatus() == NormtionPO.STATUS_INIT_INT ? NormChangeRecordPO.CHANGETYPE_ENABLE_INT : NormChangeRecordPO.CHANGETYPE_DISABLE_INT, userId)
					.orderId(normtionPO.getOrderId()).qid(normtionPO.getQid()).refId(normtionPO.getNid())
					.before(String.format("状态: %s", oldStatus == NormtionPO.STATUS_INIT_INT ? "启用" : "禁用"))
					.after(String.format("状态: %s", normtionVO.getStatus() == NormtionPO.STATUS_INIT_INT ? "启用" : "禁用")));
		}

		return 0;
	}

	@Override
	public List<QuotationFunctionAreaVO> queryQuotationNormtime(QuotationVO quotationVO, Short schedule) throws FLException {

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();

			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);

			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<?> quotationFunctionAreaItemMOs = quotationNormtimeDao.queryQuotationFunctionAreaItem(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId(), schedule);

			for (Object quotationFunctionAreaItemMO : quotationFunctionAreaItemMOs) {

				Object[] data = (Object[]) quotationFunctionAreaItemMO;

				QuotationFunctionAreaItemMO item = (QuotationFunctionAreaItemMO) data[0];
				NormtimePO normtimePO = (NormtimePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				quotationFunctionAreaItemVO.setNormtime(new NormtimeVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(item, quotationFunctionAreaItemVO, Arrays.asList("normood", "normrice"));

				BeanUtil.copyProperties(normtimePO, quotationFunctionAreaItemVO.getNormtime(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, quotationFunctionAreaItemVO.getNormtime().getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				quotationFunctionAreaItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}

			quotationFunctionAreaVO.setQuotationFunctionAreaItems(quotationFunctionAreaItemVOs);

			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}

		return quotationFunctionAreaVOs;
	}

	@Override
	public List<ExtensionVO> queryExtensionNormtime(ExtensionVO extensionVO, Short schedule) throws FLException {

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());
		List<ExtensionVO> extensionVOs = new ArrayList<ExtensionVO>();

		for (ExtensionPO extensionPO : extensionPOs) {

			extensionVO = new ExtensionVO();

			BeanUtil.copyPropertie(extensionPO, extensionVO, Arrays.asList("creater"));

			List<ExtensionItemVO> extensionItemVOs = new ArrayList<ExtensionItemVO>();
			List<?> extensionItemMOs = quotationNormtimeDao.queryExtensionItem(extensionPO.getEid(), schedule);

			for (Object extensionItemMO : extensionItemMOs) {

				Object[] data = (Object[]) extensionItemMO;

				ExtensionItemPO extensionItemPO = (ExtensionItemPO) data[0];
				NormtimePO normtimePO = (NormtimePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				ExtensionItemVO extensionItemVO = new ExtensionItemVO();
				extensionItemVO.setNormtime(new NormtimeVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(extensionItemPO, extensionItemVO, Arrays.asList("quotationFunctionArea"));

				BeanUtil.copyProperties(normtimePO, extensionItemVO.getNormtime(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, extensionItemVO.getNormtime().getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

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
	public List<AddReduceVO> queryAddReduceNormtime(AddReduceVO addReduceVO, Short schedule) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();

		Short status = addReduceVO.getStatus();

		for (AddReducePO addReducePO : addReducePOs) {

			if (status == null && !Arrays.asList(AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT).contains(addReducePO.getStatus()) && addReducePO.getType() == AddReducePO.TYPE_ADD_INT && addReducePO.getPaytype() == AddReducePO.PAYTYPE_PAY_INT) continue;

			addReduceVO = new AddReduceVO();

			BeanUtil.copyPropertie(addReducePO, addReduceVO, Arrays.asList("creater", "constructionNode"));

			List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
			List<?> addReduceItemMOs = quotationNormtimeDao.queryAddReduceItem(addReducePO.getArId(), schedule);

			for (Object addReduceItemMO : addReduceItemMOs) {

				Object[] data = (Object[]) addReduceItemMO;

				AddReduceItemPO addReduceItemPO = (AddReduceItemPO) data[0];
				NormtimePO normtimePO = (NormtimePO) data[1];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[2];

				AddReduceItemVO addReduceItemVO = new AddReduceItemVO();
				addReduceItemVO.setNormtime(new NormtimeVO(new ConstructionNodeVO(), null));

				BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);

				BeanUtil.copyProperties(normtimePO, addReduceItemVO.getNormtime(), Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, addReduceItemVO.getNormtime().getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

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
	public List<NormtimeVO> amountQuotationNormtime(QuotationVO quotationVO) throws FLException {

		List<QuotationFunctionAreaPO> QuotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationVO.getQid());

		List<NormtimeVO> normtimeVOs = new ArrayList<NormtimeVO>();

		for (QuotationFunctionAreaPO quotationFunctionAreaPO : QuotationFunctionAreaPOs) {

			List<?> normtimes = quotationNormtimeDao.amountQuotationNormtime(quotationFunctionAreaPO.getIndex(), quotationFunctionAreaPO.getQfaId());

			for (Object normtime : normtimes) {

				Object[] data = (Object[]) normtime;

				NormtimePO normtimePO = (NormtimePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Double totalDays = (Double) data[2];
				Integer num = (Integer) data[4];

				NormtimeVO normtimeVO = new NormtimeVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normtimePO, normtimeVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				normtimeVO.setTotalDays(new java.math.BigDecimal(totalDays));
				normtimeVO.setNum(num);

				normtimeVOs.add(normtimeVO);
			}
		}

		return normtimeVOs;
	}

	@Override
	public List<NormtimeVO> amountExtensionNormtime(ExtensionVO extensionVO) throws FLException {

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(extensionVO.getOrderId());

		List<NormtimeVO> normtimeVOs = new ArrayList<NormtimeVO>();

		for (ExtensionPO extensionPO : extensionPOs) {

			List<?> normtimes = quotationNormtimeDao.amountExtensionNormtime(extensionPO.getEid());

			for (Object normtime : normtimes) {

				Object[] data = (Object[]) normtime;

				NormtimePO normtimePO = (NormtimePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Double totalDays = (Double) data[2];
				Integer num = (Integer) data[4];

				NormtimeVO normtimeVO = new NormtimeVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normtimePO, normtimeVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				normtimeVO.setTotalDays(new java.math.BigDecimal(totalDays));
				normtimeVO.setNum(num);

				normtimeVOs.add(normtimeVO);
			}
		}

		return normtimeVOs;
	}

	@Override
	public List<NormtimeVO> amountAddReduceNormtime(AddReduceVO addReduceVO) throws FLException {

		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());

		List<NormtimeVO> normtimeVOs = new ArrayList<NormtimeVO>();

		for (AddReducePO addReducePO : addReducePOs) {

			List<?> normtimes = quotationNormtimeDao.amountAddReduceNormtime(addReducePO.getArId());

			for (Object normtime : normtimes) {

				Object[] data = (Object[]) normtime;

				NormtimePO normtimePO = (NormtimePO) data[0];
				ConstructionNodePO constructionNodePO = (ConstructionNodePO) data[1];
				Double totalDays = (Double) data[2];
				Integer num = (Integer) data[4];

				NormtimeVO normtimeVO = new NormtimeVO(new ConstructionNodeVO(), null);

				BeanUtil.copyProperties(normtimePO, normtimeVO, Arrays.asList("constructionNode", "quotationItem"));
				BeanUtil.copyProperties(constructionNodePO, normtimeVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

				normtimeVO.setTotalDays(new java.math.BigDecimal(totalDays));
				normtimeVO.setNum(num);

				normtimeVOs.add(normtimeVO);
			}
		}

		return normtimeVOs;
	}
	/**
	 * 三方定额补数闸(Phase 2 接线, 供 makeNormtion 两入口调用):
	 * 公司启用三方补数(norm.sync.enable 公司行)且默认报价无功能区明细(本地报价项定额流程无数据可生成)时,
	 * 走 A20261117 三方补数(按装修单整单维度仅补缺落工费/辅料定额行, fail-closed)并返回 true; 其余情况返回 false
	 * 继续本地原有逻辑(开关未配/报价不存在/有功能区明细均保持原行为)。调用方须在本地 disable 之前调用。
	 */
	private boolean tryNormSyncForQuotation(String orderId, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) return false; // 本地流程自行报 140013

		SystemConfigPO enableConfig = systemConfigDao.querySystemConfig("norm.sync.enable", decorationPO.getCompany());

		if (enableConfig == null || !"1".equals(enableConfig.getValue())) return false; // 未启用走现有逻辑

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) return false; // 本地流程自行报 200003

		if (!quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid()).isEmpty()) return false; // 有功能区明细走本地

		syncNormriceItem(orderId, userId);
		syncNormoodItem(orderId, userId);

		return true;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncNormriceItem(String orderId, String userId) throws FLException {

		QuotationPO quotationPO = prepareForSync(orderId, userId);

		if (quotationPO == null) {
			return 0;
		}

		JSONArray laborFees = queryNormSync(orderId, PATH_LABOR_FEE);

		// 解析+字典校验(fail-closed: cnid 查不到施工节点字典即中止)
		Map<Long, ConstructionNodePO> nodeByCnid = new LinkedHashMap<Long, ConstructionNodePO>();
		Map<Long, Integer> salaryByCnid = new LinkedHashMap<Long, Integer>();
		parseLaborFees(laborFees, nodeByCnid, salaryByCnid);

		// 占用检查(仅补缺): 该单 type=3 现存 INIT/CONFIRMED 行同 cnid 跳过
		Set<Long> occupiedCnids = new HashSet<Long>();

		for (NormriceItemPO itemPO : normriceItemDao.queryNormriceItemByType(quotationPO.getQid(), NormriceItemPO.TYPE_QUOTA_INT)) {
			if (itemPO.getConstructionNode() != null) {
				occupiedCnids.add(itemPO.getConstructionNode().getCnid());
			}
		}

		// 落实例行: normtion 单据锚单(qid/sid), 不关联报价项(qiid/areald/quoteld/npid 置 0)
		int count = 0;

		for (Map.Entry<Long, Integer> entry : salaryByCnid.entrySet()) {

			if (occupiedCnids.contains(entry.getKey())) {
				log.info(String.format("三方工费行跳过(该单已有同节点定额行), orderId:%s, cnid:%s", orderId, entry.getKey()));
				continue;
			}

			ConstructionNodePO nodePO = nodeByCnid.get(entry.getKey());

			NormriceItemPO normriceItemPO = new NormriceItemPO();
			normriceItemPO.setQid(quotationPO.getQid());
			normriceItemPO.setSid(quotationPO.getQid());
			normriceItemPO.setType(NormriceItemPO.TYPE_QUOTA_INT);
			normriceItemPO.setNormtype(NormriceItemPO.NORMTYPE_ADD_INT); // 附加确认流: confirmNormriceItem 确认后计入工资核算
			normriceItemPO.setAtttype(NormriceItemPO.ATTTYPE_COLLECTION_INT);
			normriceItemPO.setConstructionNode(nodePO);
			normriceItemPO.setName(nodePO.getName());
			normriceItemPO.setTrannum(0); // 总额行约定(trannum=0): salary 即金额(厘), 工资SQL/前端不乘工程量
			normriceItemPO.setSalary(entry.getValue());
			normriceItemPO.setNum(0);
			normriceItemPO.setStatus(NormriceItemPO.STATUS_INIT_INT);
			normriceItemDao.save(normriceItemPO);

			count++;
		}

		log.info(String.format("三方工费补数完成, orderId:%s, 接口行数:%s, 补插:%s行", orderId, salaryByCnid.size(), count));

		return count;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncNormoodItem(String orderId, String userId) throws FLException {

		QuotationPO quotationPO = prepareForSync(orderId, userId);

		if (quotationPO == null) {
			return 0;
		}

		JSONArray auxiliaries = queryNormSync(orderId, PATH_AUXILIARY);

		// 解析+字典校验(fail-closed: nid 查不到定材字典即中止)
		Map<Long, NoodsPO> noodsByNid = new LinkedHashMap<Long, NoodsPO>();
		Map<Long, Integer> numByNid = new LinkedHashMap<Long, Integer>();
		parseAuxiliaries(auxiliaries, noodsByNid, numByNid);

		// 占用检查(仅补缺): 该单现存 INIT 行同 nid 跳过
		Set<Long> occupiedNids = new HashSet<Long>();

		for (NormoodItemPO itemPO : normoodItemDao.queryNormoodItem(quotationPO.getQid())) {
			if (itemPO.getNoods() != null) {
				occupiedNids.add(itemPO.getNoods().getNid());
			}
		}

		// 落实例行: normtion 单据锚单(qid/sid), 不关联报价项(qiid/areald/quoteld/ngid 置 0)
		int count = 0;

		for (Map.Entry<Long, Integer> entry : numByNid.entrySet()) {

			if (occupiedNids.contains(entry.getKey())) {
				log.info(String.format("三方辅料行跳过(该单已有同定材定额行), orderId:%s, nid:%s", orderId, entry.getKey()));
				continue;
			}

			NormoodItemPO normoodItemPO = new NormoodItemPO();
			normoodItemPO.setQid(quotationPO.getQid());
			normoodItemPO.setSid(quotationPO.getQid());
			normoodItemPO.setType(NormoodItemPO.TYPE_QUOTA_INT);
			normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_MATERIAL_INT);
			normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);
			normoodItemPO.setNoods(noodsByNid.get(entry.getKey()));
			normoodItemPO.setNormnum(entry.getValue()); // 实例层直存实际量(毫), 辅料管控 amountNormoodItem INIT 即计
			normoodItemPO.setStorenum(entry.getValue());
			normoodItemPO.setStatus(NormoodItemPO.STATUS_INIT_INT);
			normoodItemDao.save(normoodItemPO);

			count++;
		}

		log.info(String.format("三方辅料补数完成, orderId:%s, 接口行数:%s, 补插:%s行", orderId, numByNid.size(), count));

		return count;
	}

	/**
	 * 公共前置: 装修单判断(140013) → 公司开关(norm.sync.enable 公司行, 未配置走现有逻辑) → 报价判断(200003, 报价可无明细但行必须存在——normtion/实例均以 qid 锚单) → normtion 单据头判断不存在创建。
	 * 
	 * @return 报价单; null = 公司未启用三方补数(走现有逻辑)
	 */
	private QuotationPO prepareForSync(String orderId, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		SystemConfigPO enableConfig = systemConfigDao.querySystemConfig(KEY_SYNC_ENABLE, decorationPO.getCompany());

		if (enableConfig == null || !"1".equals(enableConfig.getValue())) {
			log.info(String.format("三方定额补数公司未启用, 走现有逻辑, orderId:%s, company:%s", orderId, decorationPO.getCompany()));
			return null;
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(quotationPO.getQid());

		if (normtionPO == null) {
			normtionPO = new NormtionPO();
			normtionPO.setQid(quotationPO.getQid());
			normtionPO.setOrderId(orderId);
			normtionPO.setCreater(userDao.queryUserByUserId(userId));
			normtionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			normtionDao.save(normtionPO);
		}

		return quotationPO;
	}

	/**
	 * 调上方定额接口: 基地址公司行优先、无则集团行(company=0), 密钥固定集团行(cost.app.secret); 缺配置 200132 / 调用失败或 code≠0 200133 / data 为空 200134, 全部 fail-closed 中止。
	 */
	private JSONArray queryNormSync(String orderId, String path) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		SystemConfigPO urlConfig = systemConfigDao.querySystemConfig(KEY_SYNC_URL, decorationPO.getCompany());

		if (urlConfig == null) {
			urlConfig = systemConfigDao.querySystemConfig(KEY_SYNC_URL, 0);
		}

		SystemConfigPO secretConfig = systemConfigDao.querySystemConfig(KEY_APP_SECRET, 0);

		if (urlConfig == null || urlConfig.getValue() == null || "".equals(urlConfig.getValue().trim()) || secretConfig == null || secretConfig.getValue() == null || "".equals(secretConfig.getValue().trim())) {
			throw new FLException(200132, "三方定额接口未配置");
		}

		JSONObject response = postForSync(urlConfig.getValue().trim() + path, buildBody(orderId), secretConfig.getValue().trim());

		if (response == null || response.get("code") == null || response.getIntValue("code") != 0) {
			log.error(String.format("三方定额接口调用失败, orderId:%s, api:%s, response:%s", orderId, path, response == null ? "null" : response.toJSONString()));
			throw new FLException(200133, "三方定额接口调用失败");
		}

		JSONArray data = response.getJSONArray("data");

		if (data == null || data.isEmpty()) {
			throw new FLException(200134, "三方定额数据为空");
		}

		return data;
	}

	/** 工费行解析: id(erpId串)=cnid → constructionNode 字典校验; amount(元4位小数) → salary(厘, ×1000 截断, ≤0 异常) */
	private void parseLaborFees(JSONArray laborFees, Map<Long, ConstructionNodePO> nodeByCnid, Map<Long, Integer> salaryByCnid) throws FLException {

		for (int i = 0; i < laborFees.size(); i++) {

			JSONObject row = laborFees.getJSONObject(i);

			String idStr = row == null ? null : row.getString("id");

			if (idStr == null || "".equals(idStr.trim()) || !idStr.trim().matches("\\d+")) {
				log.error(String.format("三方定额工费行id非法, row:%s", row));
				throw new FLException(200135, "三方定额数据异常");
			}

			long cnid = Long.parseLong(idStr.trim());

			ConstructionNodePO nodePO = constructionNodeDao.get(cnid);

			if (nodePO == null) {
				log.error(String.format("三方定额工费行cnid不存在施工节点字典, cnid:%s", cnid));
				throw new FLException(200135, "三方定额数据异常");
			}

			BigDecimal amount = row.getBigDecimal("amount");
			int salary = amount == null ? 0 : amount.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue();

			if (amount == null || salary <= 0) {
				log.error(String.format("三方定额工费行amount缺失或非正, cnid:%s, amount:%s", cnid, amount));
				throw new FLException(200135, "三方定额数据异常");
			}

			if (nodeByCnid.containsKey(cnid)) {
				log.warn(String.format("三方定额工费行cnid重复, 取末行, cnid:%s", cnid));
			}

			nodeByCnid.put(cnid, nodePO);
			salaryByCnid.put(cnid, salary);
		}
	}

	/** 辅料行解析: nid → noods 字典校验; quantity(4位小数) → 需求量(毫, ×1000 截断, ≤0 异常) */
	private void parseAuxiliaries(JSONArray auxiliaries, Map<Long, NoodsPO> noodsByNid, Map<Long, Integer> numByNid) throws FLException {

		for (int i = 0; i < auxiliaries.size(); i++) {

			JSONObject row = auxiliaries.getJSONObject(i);

			Long nid = row == null ? null : row.getLong("nid");

			if (nid == null) {
				log.error(String.format("三方定额辅料行nid缺失, row:%s", row));
				throw new FLException(200135, "三方定额数据异常");
			}

			NoodsPO noodsPO = noodsDao.get(nid);

			if (noodsPO == null) {
				log.error(String.format("三方定额辅料行nid不存在定材字典, nid:%s", nid));
				throw new FLException(200135, "三方定额数据异常");
			}

			BigDecimal quantity = row.getBigDecimal("quantity");
			int num = quantity == null ? 0 : quantity.movePointRight(3).setScale(0, RoundingMode.DOWN).intValue();

			if (quantity == null || num <= 0) {
				log.error(String.format("三方定额辅料行quantity缺失或非正, nid:%s, quantity:%s", nid, quantity));
				throw new FLException(200135, "三方定额数据异常");
			}

			if (noodsByNid.containsKey(nid)) {
				log.warn(String.format("三方定额辅料行nid重复, 取末行, nid:%s", nid));
			}

			noodsByNid.put(nid, noodsPO);
			numByNid.put(nid, num);
		}
	}

	private String buildBody(String orderId) {

		JSONObject body = new JSONObject();
		body.put("erpOrderCode", orderId);

		return body.toJSONString();
	}

	/**
	 * 签名 POST(fl-sync 统一验签, 与 DecorationActivityCostServiceImpl 同款): headers appId/timestamp(毫秒, 时差≤30s)/nonce(60s 防重)/sign; sign = SHA256_HEX(queryString + "#" + rawBody + "##" + headerString + "###" + appSecret), 本接口业务参数全在 Body(queryString 空串), headerString 仅 appId/nonce/timestamp 按名称升序; rawBody 签名与发送必须同一份序列化串。 任何失败(网络/超时/HTTP 非 200/解析)仅 log.error 并返回 null, 由调用方 fail-closed 中止。
	 */
	private JSONObject postForSync(String url, String rawBody, String secret) {

		String timestamp = String.valueOf(System.currentTimeMillis());
		String nonce = nonce();
		String headerString = "appId=" + APP_ID + "&nonce=" + nonce + "&timestamp=" + timestamp;
		String sign = sha256Hex("#" + rawBody + "##" + headerString + "###" + secret);

		if (sign == null) {
			return null;
		}

		HttpURLConnection connection = null;

		try {

			connection = (HttpURLConnection) new URL(url).openConnection();
			connection.setRequestMethod("POST");
			connection.setConnectTimeout(CONNECT_TIMEOUT);
			connection.setReadTimeout(READ_TIMEOUT);
			connection.setDoOutput(true);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.setRequestProperty("appId", APP_ID);
			connection.setRequestProperty("timestamp", timestamp);
			connection.setRequestProperty("nonce", nonce);
			connection.setRequestProperty("sign", sign);

			OutputStream os = connection.getOutputStream();
			os.write(rawBody.getBytes("UTF-8"));
			os.flush();
			os.close();

			int code = connection.getResponseCode();
			InputStream stream = code >= 400 ? connection.getErrorStream() : connection.getInputStream();

			BufferedReader reader = new BufferedReader(new InputStreamReader(stream, "UTF-8"));

			StringBuilder response = new StringBuilder();

			String line = null;

			while ((line = reader.readLine()) != null) {
				response.append(line);
			}

			reader.close();

			JSONObject result = JSON.parseObject(response.toString());

			if (result == null) {
				log.error(String.format("三方定额接口响应为空, url:%s, httpCode:%s, response:%s", url, code, response.toString()));
				return null;
			}

			return result;

		} catch (Exception e) {
			log.error(String.format("三方定额接口调用异常, url:%s", url), e);
			return null;
		} finally {
			if (connection != null) {
				connection.disconnect();
			}
		}
	}

	private String nonce() {

		byte[] bytes = new byte[16];

		RANDOM.nextBytes(bytes);

		StringBuilder sb = new StringBuilder(32);

		for (byte b : bytes) {
			sb.append(String.format("%02x", b));
		}

		return sb.toString();
	}

	private String sha256Hex(String text) {

		try {

			MessageDigest digest = MessageDigest.getInstance("SHA-256");

			byte[] bytes = digest.digest(text.getBytes("UTF-8"));

			StringBuilder sb = new StringBuilder(64);

			for (byte b : bytes) {
				sb.append(String.format("%02x", b));
			}

			return sb.toString();

		} catch (Exception e) {
			log.error("三方定额接口签名计算异常", e);
			return null;
		}
	}


}
