package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.material.dao.FormatDao;
import com.fanglin.data.po.FormatPO;

@Service("formatImportService")
@Transactional(readOnly = true)
public class FormatImportService implements com.fanglin.imports.service.FormatImportService {

	private static final short COLUMN_STATUS_INT = 0;

	@Autowired
	private FormatDao formatDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importFormat(List<List<String>> excels) {

		int index = 1;

		for (int i = 0; i < excels.size(); i++) {

			List<String> _salary = excels.get(i);

			Long gid = (long) Math.floor(Double.parseDouble(_salary.get(0)));

			String info = _salary.get(2);

			FormatPO formatPO = formatDao.queryFormatByInfo(gid, info);

			if (formatPO != null) {

				index++;

				continue;

			} else {

				formatPO = new FormatPO();

				formatPO.setGid(gid);

				formatPO.setInfo(info);

				formatPO.setStatus(COLUMN_STATUS_INT);

				formatDao.save(formatPO);

				index++;
			}

			if (index % 100 == 0) {

				formatDao.flush();

			}
		}

	}

}
