package com.fanglin.imports.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;

public interface UserSalaryImportService {

	public void importUserSalary(List<List<String>> excels, String userId) throws FLException;

}
