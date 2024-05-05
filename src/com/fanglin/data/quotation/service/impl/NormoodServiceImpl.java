package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.NormoodDao;
import com.fanglin.data.quotation.service.NormoodService;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("normoodService")
@Transactional(readOnly = true)
public class NormoodServiceImpl implements NormoodService {

	@Autowired
	private NormoodDao normoodDao;

	@Autowired
	private NoodsDao noodsDao;

	@Override
	public void pageNormood(Paging paging, List<Filter> filters) {

		List<NormoodPO> normoodPOs = normoodDao.pageNormood(paging, filters);
		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (NormoodPO normoodPO : normoodPOs) {

			NormoodVO normoodVO = new NormoodVO(new NoodsVO(), new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO()));

			BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("noods", "quotationItem"));
			BeanUtil.copyPropertie(normoodPO.getNoods(), normoodVO.getNoods());

			normoodPO.getQuotationItem().ptv(normoodVO.getQuotationItem());

			normoodVOs.add(normoodVO);
		}

		paging.setData(normoodVOs);
	}

	@Override
	public List<NormoodVO> queryNormoodByQiid(Long qiid) {

		List<NormoodPO> normoodPOs = normoodDao.queryNormoodByQiid(qiid);
		List<NormoodVO> normoodVOs = new ArrayList<NormoodVO>();

		for (NormoodPO normoodPO : normoodPOs) {

			NormoodVO normoodVO = new NormoodVO(new NoodsVO(), new QuotationItemVO(null, null, null, null, null, new WorkTypeVO(), new MeasurementUnitVO(), null));

			BeanUtil.copyProperties(normoodPO, normoodVO, Arrays.asList("noods", "quotationItem"));
			BeanUtil.copyPropertie(normoodPO.getNoods(), normoodVO.getNoods());

			normoodPO.getQuotationItem().ptv(normoodVO.getQuotationItem());

			normoodVOs.add(normoodVO);
		}

		return normoodVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormood(NormoodVO normoodVO) throws FLException {

		NormoodPO normoodPO = new NormoodPO();

		BeanUtil.copyPropertie(normoodVO, normoodPO, Arrays.asList("noods", "quotationItem"));

		NoodsPO noodsPO = noodsDao.get(normoodVO.getNoods().getNid());

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		normoodPO.setName(noodsPO.getName());
		normoodPO.setNoods(noodsPO);
		normoodPO.setQuotationItem(new QuotationItemPO(normoodVO.getQuotationItem().getQiid()));

		normoodPO.setStatus(NormoodPO.STATUS_VALID_STR);

		normoodDao.save(normoodPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormood(NormoodVO normoodVO) {

		normoodDao.deleteById(normoodVO.getNgid());

		return 0;
	}

}
