package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.WorkTypeDao;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.data.material.dao.AccessoriesTypeDao;
import com.fanglin.data.po.AccessoriesTypePO;

@Service("accessoriesTypeImportService")
@Transactional(readOnly = true)
public class AccessoriesTypeImportService implements com.fanglin.imports.service.AccessoriesTypeImportService {

	private static final short COLUMN_STATUS_INT = 0;

	@Autowired
	private WorkTypeDao workTypeDao;

	@Autowired
	private AccessoriesTypeDao accessoriesTypeDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importAccessoriesType(List<List<String>> excels) {

		int index = 1;

		AccessoriesTypePO accessoriesTypePO;

		for (int i = 0; i < excels.size(); i++) {

			List<String> _salary = excels.get(i);

			String name = _salary.get(0);

			Integer wtid = Integer.valueOf(_salary.get(1));

			WorkTypePO workTypePO = workTypeDao.get(wtid);

			String comment = _salary.get(2);

			accessoriesTypePO = new AccessoriesTypePO();

			accessoriesTypePO.setName(name);

			accessoriesTypePO.setWorkType(workTypePO);

			accessoriesTypePO.setStatus(COLUMN_STATUS_INT);

			accessoriesTypePO.setComment(comment);

			accessoriesTypeDao.save(accessoriesTypePO);

			index++;

			if (index % 100 == 0) {
				workTypeDao.flush();
				accessoriesTypeDao.flush();
			}
		}

	}
}
