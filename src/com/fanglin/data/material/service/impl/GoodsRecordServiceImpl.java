package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.GoodsKindVO;
import com.fanglin.data.material.dao.AoodsDao;
import com.fanglin.data.material.dao.GoodsRecordDao;
import com.fanglin.data.material.dao.SoodsDao;
import com.fanglin.data.material.service.GoodsRecordService;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.material.vo.GoodsRecordVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.material.vo.SoodsVO;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.data.po.GoodsRecordPO;
import com.fanglin.data.po.SoodsPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("goodsRecordService")
@Transactional(readOnly = true)
public class GoodsRecordServiceImpl implements GoodsRecordService {

	@Autowired
	private GoodsRecordDao goodsRecordDao;

	@Autowired
	private SoodsDao soodsDao;

	@Autowired
	private AoodsDao aoodsDao;

	@Override
	public void pageGoodsRecord(Paging paging, List<Filter> filters, GoodsRecordVO goodsRecord) {

		List<GoodsRecordPO> goodsRecordPOs = goodsRecordDao.pageGoodsRecord(paging, filters, goodsRecord.getGoods().getGid());
		List<GoodsRecordVO> goodsRecordVOs = new ArrayList<GoodsRecordVO>();

		for (GoodsRecordPO goodsRecordPO : goodsRecordPOs) {

			GoodsRecordVO goodsRecordVO = new GoodsRecordVO(new GoodsVO(new AccessoriesTypeVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO(), new GoodsKindVO()), new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			goodsRecordVO = goodsRecordPO.ptv(goodsRecordVO);

			if (goodsRecordPO.getType() == GoodsRecordPO.TYPE_SOODS_SHORT) {

				SoodsPO soodsPO = soodsDao.get(goodsRecordPO.getSid());

				SoodsVO soodsVO = new SoodsVO();

				BeanUtil.copyProperties(soodsPO, soodsVO, Arrays.asList("goods"));

				goodsRecordVO.setSoods(soodsVO);

			} else if (goodsRecordPO.getType() == GoodsRecordPO.TYPE_AOODS_SHORT) {

				AoodsPO aoodsPO = aoodsDao.get(goodsRecordPO.getSid());

				AoodsVO aoodsVO = new AoodsVO();

				BeanUtil.copyProperties(aoodsPO, aoodsVO, Arrays.asList("goods", "accessoriesType", "noods", "constructionNode"));

				goodsRecordVO.setAoods(aoodsVO);

			}

			goodsRecordVOs.add(goodsRecordVO);

		}

		paging.setData(goodsRecordVOs);

	}

}
