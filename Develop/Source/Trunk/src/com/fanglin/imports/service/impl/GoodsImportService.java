package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.AssisTypeDao;
import com.fanglin.inventory.dao.GoodsDao;
import com.fanglin.inventory.po.AssisTypePO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.utils.PinYin4Util;

@Service("goodsImportService")
@Transactional(readOnly = true)
public class GoodsImportService implements com.fanglin.imports.service.GoodsImportService {

	private static final short COLUMN_STATUS_INT = 0;

	private static final short COLUMN_TYPE_INT = 0;

	@Autowired
	private AssisTypeDao assisTypeDao;

	@Autowired
	private GoodsDao goodsDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importGoods(List<List<String>> excels, int company) {

		int index = 1;

		AssisTypePO assisTypePO;
		GoodsPO goodsPO;

		for (int i = 0; i < excels.size(); i++) {

			List<String> _salary = excels.get(i);

			String no = _salary.get(0);

			String name = _salary.get(1);

			String barcode = _salary.get(2);

			String category = _salary.get(3);

			String brand = _salary.get(4);

			String measurementUnit = _salary.get(5);

			Float pieceNum = Float.valueOf(_salary.get(6));

			String assisTypeName = _salary.get(7);

			goodsPO = new GoodsPO();

			if (assisTypeName != "" || assisTypeName != null) {
				assisTypePO = assisTypeDao.queryAssisTypeByName(assisTypeName);
				goodsPO.setAssisType(assisTypePO);
			}

			goodsPO.setNo(no);
			goodsPO.setName(name);
			goodsPO.setBarcode(barcode);
			goodsPO.setCategory(category);
			goodsPO.setBrand(brand);
			goodsPO.setMeasurementUnit(measurementUnit);
			goodsPO.setPieceNum(pieceNum);
			goodsPO.setType(COLUMN_TYPE_INT);
			goodsPO.setStatus(COLUMN_STATUS_INT);

			List<String> pinyins = PinYin4Util.getPinyin(name);

			goodsPO.setPinyin(pinyins.subList(0,
					pinyins.size() >= 2 ? 2 : pinyins.size()).toString());

			goodsPO.setCompany(company);

			goodsDao.save(goodsPO);

			index++;

			if (index % 100 == 0) {
				assisTypeDao.flush();
				goodsDao.flush();
			}
		}

	}

}
