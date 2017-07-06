package com.fanglin.salary.service;

import java.util.List;

public interface WorkerSalaryImportService {
	
	public void updateWorkerSalaryForAdvance(List<List<String>> excels, String userId);

	public void importWorkerSalary(List<List<String>> excels, String userId);

}
