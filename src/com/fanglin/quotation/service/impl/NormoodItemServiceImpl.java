package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.po.NormpackItemPO;
import com.fanglin.data.quotation.dao.impl.NormpackItemDaoImpl;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormoodItemService;
import com.fanglin.quotation.vo.NormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("normoodItemService")
@Transactional(readOnly = true)
public class NormoodItemServiceImpl implements NormoodItemService {

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormpackItemDaoImpl normpackItemDaoImpl;

	@Autowired
	private NoodsDao noodsDao;

	@Override
	public List<NormoodItemVO> queryNormoodItem(NormoodItemVO normoodItem) {

		List<NormoodItemPO> normoodItemPOs = normoodItemDao.queryNormoodItem(normoodItem.getQid());
		List<NormoodItemVO> normoodItemVOs = new ArrayList<NormoodItemVO>();

		for (NormoodItemPO normoodItemPO : normoodItemPOs) {

			normoodItem = new NormoodItemVO(new NoodsVO());

			BeanUtil.copyProperties(normoodItemPO, normoodItem, Arrays.asList("noods"));
			BeanUtil.copyPropertie(normoodItemPO.getNoods(), normoodItem.getNoods());

			normoodItemVOs.add(normoodItem);
		}

		return normoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<NormoodItemVO> addNormoodItem(QuotationVO quotationVO, List<NormoodItemVO> normoodItemVOs) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		List<NormpackItemPO> normpackItems = new ArrayList<NormpackItemPO>();

		for (NormoodItemVO normoodItemVO : normoodItemVOs) {

			if (normoodItemVO.getSid() != null) {

				List<NormpackItemPO> normpackItemPOs = normpackItemDaoImpl.queryNormpackItem(normoodItemVO.getSid());

				normpackItems.addAll(normpackItemPOs);

			} else {

				normpackItems = null;

				normoodItemVOs = new ArrayList<NormoodItemVO>();

				NormoodItemPO normoodItemPO = new NormoodItemPO();

				normoodItemPO.setQid(quotationPO.getQid());

				normoodItemPO.setType(NormoodItemPO.TYPE_QUOTA_INT);
				normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_MATERIAL_INT);
				normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);

				normoodItemPO.setNormunit(normoodItemVO.getNormunit());
				normoodItemPO.setNormnum(normoodItemVO.getNormnum());
				normoodItemPO.setStoreunit(normoodItemVO.getStoreunit());
				normoodItemPO.setStorenum(normoodItemVO.getStorenum());

				NoodsPO noodsPO = noodsDao.get(normoodItemVO.getNoods().getNid());

				normoodItemPO.setNoods(noodsPO);

				normoodItemDao.save(normoodItemPO);

				normoodItemVO = new NormoodItemVO(new NoodsVO());

				BeanUtil.copyProperties(normoodItemPO, normoodItemVO, Arrays.asList("noods"));
				BeanUtil.copyPropertie(normoodItemPO.getNoods(), normoodItemVO.getNoods());

				normoodItemVOs.add(normoodItemVO);
			}
		}

		if (normpackItems == null || normpackItems.size() == 0) return normoodItemVOs;

		normoodItemVOs = new ArrayList<NormoodItemVO>();

		for (NormpackItemPO normpackItemPO : normpackItems) {

			NormoodItemPO normoodItemPO = new NormoodItemPO();

			normoodItemPO.setQid(quotationPO.getQid());
			normoodItemPO.setSid(quotationPO.getQid());

			normoodItemPO.setType(NormoodItemPO.TYPE_QUOTA_INT);
			normoodItemPO.setNormtype(NormoodItemPO.NORMTYPE_PACK_INT);
			normoodItemPO.setAtttype(NormoodItemPO.ATTTYPE_COLLECTION_INT);

			if (normpackItemPO.getNoods() != null) {
				normoodItemPO.setNoods(new NoodsPO(normpackItemPO.getNoods().getNid()));
			}

			normoodItemPO.setNormunit(normpackItemPO.getNormunit());
			normoodItemPO.setNormnum(normpackItemPO.getNormnum());
			normoodItemPO.setStoreunit(normpackItemPO.getStoreunit());
			normoodItemPO.setStorenum(normpackItemPO.getStorenum());
			normoodItemPO.setNoods(normpackItemPO.getNoods());

			normoodItemDao.save(normoodItemPO);

			NormoodItemVO normoodItemVO = new NormoodItemVO(new NoodsVO());

			BeanUtil.copyProperties(normoodItemPO, normoodItemVO, Arrays.asList("noods"));
			BeanUtil.copyPropertie(normoodItemPO.getNoods(), normoodItemVO.getNoods());

			normoodItemVOs.add(normoodItemVO);
		}

		return normoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormoodItem(NormoodItemVO normoodItemVO) throws FLException {

		NormoodItemPO normoodItemPO = normoodItemDao.get(normoodItemVO.getNgiid());

		if (normoodItemPO == null) {

		}

		normoodItemDao.delete(normoodItemPO);

		return 0;
	}

	@Override
	public int amountNormoodItem(NormoodItemVO normoodItemVO) {
		return normoodItemDao.amountNormoodItem(normoodItemVO.getQid(), normoodItemVO.getNoods().getNid());
	}

}
